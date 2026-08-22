#!/usr/bin/env python3
"""Fetch Google Ads daily campaign data → hub/data/google/ads_metrics.json."""

import json
import os
import sys
from datetime import date, timedelta
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from google.ads.googleads.client import GoogleAdsClient


def get_client():
    return GoogleAdsClient.load_from_dict({
        "developer_token":    os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id":          os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret":      os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token":      os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "login_customer_id":  os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
        "use_proto_plus":     True,
    })


def fetch(client, customer_id: str, date_from: str, date_to: str) -> dict:
    service = client.get_service("GoogleAdsService")

    # Account info
    account = {}
    try:
        for row in service.search(customer_id=customer_id, query="""
            SELECT customer.id, customer.descriptive_name,
                   customer.currency_code, customer.time_zone
            FROM customer LIMIT 1
        """):
            account = {
                "id":       str(row.customer.id),
                "name":     row.customer.descriptive_name,
                "currency": row.customer.currency_code,
                "timezone": row.customer.time_zone,
            }
    except Exception as e:
        account = {"error": str(e)}

    # Daily campaign metrics
    daily_map = defaultdict(dict)  # date → campaign_id → metrics dict

    try:
        for row in service.search(customer_id=customer_id, query=f"""
            SELECT
                segments.date,
                campaign.id,
                campaign.name,
                campaign.status,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.ctr,
                metrics.average_cpc,
                metrics.conversions,
                metrics.cost_per_conversion
            FROM campaign
            WHERE segments.date BETWEEN '{date_from}' AND '{date_to}'
            ORDER BY segments.date DESC, metrics.cost_micros DESC
        """):
            m = row.metrics
            day = str(row.segments.date)
            cid = str(row.campaign.id)
            daily_map[day][cid] = {
                "id":          cid,
                "name":        row.campaign.name,
                "status":      row.campaign.status.name,
                "impressions": int(m.impressions),
                "clicks":      int(m.clicks),
                "cost_usd":    round(m.cost_micros / 1_000_000, 4),
                "ctr_pct":     round(m.ctr * 100, 4),
                "avg_cpc_usd": round(m.average_cpc / 1_000_000, 4),
                "conversions": round(m.conversions, 2),
                "cpl_usd":     round(m.cost_per_conversion / 1_000_000, 2) if m.conversions > 0 else None,
            }
    except Exception as e:
        print(f"WARNING: campaign data fetch error: {e}", file=sys.stderr)

    # Build daily array (all 180 days, empty if no data)
    today = date.fromisoformat(date_to)
    start = date.fromisoformat(date_from)
    daily = []
    cur = today
    while cur >= start:
        day_str = str(cur)
        camps = list(daily_map[day_str].values()) if day_str in daily_map else []
        daily.append({"date": day_str, "campaigns": camps})
        cur -= timedelta(days=1)

    return {
        "status":     "ok",
        "fetched_at": str(date.today()),
        "period":     {"date_from": date_from, "date_to": date_to},
        "account":    account,
        "daily":      daily,
    }


def main():
    today    = date.today()
    date_to  = str(today)
    date_from = str(today - timedelta(days=179))  # 180 days incl. today

    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    client = get_client()

    print(f"Fetching {date_from} → {date_to} for account {customer_id} ...")
    data = fetch(client, customer_id, date_from, date_to)

    days_with_data = sum(1 for d in data["daily"] if d["campaigns"])
    print(f"Done. Days with data: {days_with_data}/{len(data['daily'])}")

    out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "hub", "data", "google", "ads_metrics.json"
    )
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Written → {out}")


if __name__ == "__main__":
    main()
