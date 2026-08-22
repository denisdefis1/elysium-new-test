#!/usr/bin/env python3
"""Fetch Google Ads account summary and write to hub/data/google/ads_metrics.json."""

import json
import os
import sys
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from google.ads.googleads.client import GoogleAdsClient


def get_client():
    config = {
        "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id": os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "login_customer_id": os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
        "use_proto_plus": True,
    }
    return GoogleAdsClient.load_from_dict(config)


def fetch_metrics(client, customer_id: str, date_from: str, date_to: str) -> dict:
    service = client.get_service("GoogleAdsService")

    # Account info
    account_info = {}
    try:
        for row in service.search(customer_id=customer_id, query="""
            SELECT customer.id, customer.descriptive_name,
                   customer.currency_code, customer.time_zone
            FROM customer LIMIT 1
        """):
            account_info = {
                "id": str(row.customer.id),
                "name": row.customer.descriptive_name,
                "currency": row.customer.currency_code,
                "timezone": row.customer.time_zone,
            }
    except Exception as e:
        account_info = {"error": str(e)}

    # Campaign metrics
    campaigns = []
    try:
        for row in service.search(customer_id=customer_id, query=f"""
            SELECT
                campaign.id, campaign.name, campaign.status,
                metrics.impressions, metrics.clicks, metrics.cost_micros,
                metrics.ctr, metrics.average_cpc,
                metrics.conversions, metrics.cost_per_conversion
            FROM campaign
            WHERE segments.date BETWEEN '{date_from}' AND '{date_to}'
            ORDER BY metrics.cost_micros DESC
        """):
            m = row.metrics
            cost = round(m.cost_micros / 1_000_000, 2)
            avg_cpc = round(m.average_cpc / 1_000_000, 2)
            cpl = round(m.cost_per_conversion / 1_000_000, 2) if m.conversions > 0 else None
            campaigns.append({
                "id": str(row.campaign.id),
                "name": row.campaign.name,
                "status": row.campaign.status.name,
                "impressions": m.impressions,
                "clicks": m.clicks,
                "cost_usd": cost,
                "ctr_pct": round(m.ctr * 100, 3),
                "avg_cpc_usd": avg_cpc,
                "conversions": round(m.conversions, 2),
                "cpl_usd": cpl,
            })
    except Exception as e:
        campaigns = [{"fetch_error": str(e)}]

    total_impressions = sum(c.get("impressions", 0) for c in campaigns if "fetch_error" not in c)
    total_clicks = sum(c.get("clicks", 0) for c in campaigns if "fetch_error" not in c)
    total_cost = round(sum(c.get("cost_usd", 0) for c in campaigns if "fetch_error" not in c), 2)
    total_conv = round(sum(c.get("conversions", 0) for c in campaigns if "fetch_error" not in c), 2)
    blended_ctr = round(total_clicks / total_impressions * 100, 3) if total_impressions > 0 else 0
    blended_cpl = round(total_cost / total_conv, 2) if total_conv > 0 else None

    return {
        "status": "ok",
        "fetched_at": str(date.today()),
        "period": {"date_from": date_from, "date_to": date_to},
        "account": account_info,
        "campaigns": campaigns,
        "totals": {
            "impressions": total_impressions,
            "clicks": total_clicks,
            "cost_usd": total_cost,
            "ctr_pct": blended_ctr,
            "conversions": total_conv,
            "cpl_usd": blended_cpl,
        },
    }


def main():
    today = date.today()
    date_to = str(today)
    date_from = str(today - timedelta(days=180))  # 6 months

    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    client = get_client()

    print(f"Fetching Google Ads metrics {date_from} → {date_to} for account {customer_id}...")
    data = fetch_metrics(client, customer_id, date_from, date_to)

    out_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "hub", "data", "google", "ads_metrics.json"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    campaigns_found = len([c for c in data["campaigns"] if "fetch_error" not in c])
    print(f"Done. {campaigns_found} campaigns found. Wrote to {out_path}")


if __name__ == "__main__":
    main()
