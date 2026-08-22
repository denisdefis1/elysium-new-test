#!/usr/bin/env python3
"""Fetch Google Ads daily campaign data → hub/data/google/ads_metrics.json.
Handles both direct accounts and MCC (manager) accounts automatically.
"""

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
        "developer_token":   os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id":         os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret":     os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token":     os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "login_customer_id": os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
        "use_proto_plus":    True,
    })


def is_manager_account(service, customer_id: str) -> bool:
    """Return True if this account is an MCC (manager) account."""
    try:
        for row in service.search(
            customer_id=customer_id,
            query="SELECT customer.manager FROM customer LIMIT 1",
        ):
            return bool(row.customer.manager)
    except Exception as e:
        print(f"WARNING: cannot check manager status: {e}", file=sys.stderr)
    return False


def get_client_account_ids(service, manager_id: str) -> list[str]:
    """Discover all enabled non-manager sub-accounts under an MCC."""
    try:
        resp = service.search(
            customer_id=manager_id,
            query="""
                SELECT customer_client.id, customer_client.manager, customer_client.status
                FROM customer_client
                WHERE customer_client.status = 'ENABLED'
                  AND customer_client.manager = false
            """,
        )
        ids = [str(row.customer_client.id) for row in resp]
        print(f"  MCC {manager_id} → client accounts: {ids}")
        return ids
    except Exception as e:
        print(f"WARNING: could not list sub-accounts under {manager_id}: {e}", file=sys.stderr)
        return []


def fetch_account_info(service, customer_id: str) -> dict:
    try:
        for row in service.search(
            customer_id=customer_id,
            query="""
                SELECT customer.id, customer.descriptive_name,
                       customer.currency_code, customer.time_zone
                FROM customer LIMIT 1
            """,
        ):
            return {
                "id":       str(row.customer.id),
                "name":     row.customer.descriptive_name,
                "currency": row.customer.currency_code,
                "timezone": row.customer.time_zone,
            }
    except Exception as e:
        return {"id": customer_id, "error": str(e)}
    return {"id": customer_id}


def fetch_all_campaigns_meta(service, customer_id: str) -> list[dict]:
    """All campaigns ever in this account — no date filter, no metrics."""
    camps = []
    try:
        for row in service.search(
            customer_id=customer_id,
            query="""
                SELECT campaign.id, campaign.name, campaign.status,
                       campaign.advertising_channel_type
                FROM campaign
                ORDER BY campaign.name
            """,
        ):
            c = row.campaign
            camps.append({
                "id":      str(c.id),
                "name":    c.name,
                "status":  c.status.name,
                "channel": c.advertising_channel_type.name,
            })
    except Exception as e:
        if "REQUESTED_METRICS_FOR_MANAGER" in str(e):
            return None
        print(f"WARNING: fetch_all_campaigns_meta error for {customer_id}: {e}", file=sys.stderr)
    return camps


def fetch_daily_campaigns(service, customer_id: str, date_from: str, date_to: str) -> dict:
    """Returns {date_str: {campaign_id: metrics_dict}}. None if MCC error."""
    daily_map: dict[str, dict] = defaultdict(dict)
    query = f"""
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
          AND metrics.cost_micros > 0
        ORDER BY segments.date DESC, metrics.cost_micros DESC
    """
    try:
        for row in service.search(customer_id=customer_id, query=query):
            m   = row.metrics
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
                "cpl_usd":     (round(m.cost_per_conversion / 1_000_000, 2)
                                if m.conversions > 0 else None),
            }
    except Exception as e:
        if "REQUESTED_METRICS_FOR_MANAGER" in str(e):
            return None   # caller should retry with child accounts
        print(f"WARNING: fetch error for {customer_id}: {e}", file=sys.stderr)
    return daily_map


def fetch_device_daily(service, customer_id: str, date_from: str, date_to: str):
    """Campaign metrics segmented by device type, daily."""
    rows = []
    query = f"""
        SELECT
            segments.date,
            segments.device,
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.ctr,
            metrics.average_cpc
        FROM campaign
        WHERE segments.date BETWEEN '{date_from}' AND '{date_to}'
          AND metrics.cost_micros > 0
        ORDER BY segments.date DESC, segments.device
    """
    try:
        for row in service.search(customer_id=customer_id, query=query):
            m = row.metrics
            rows.append({
                "date":        str(row.segments.date),
                "device":      row.segments.device.name,
                "campaign_id": str(row.campaign.id),
                "impressions": int(m.impressions),
                "clicks":      int(m.clicks),
                "cost_usd":    round(m.cost_micros / 1_000_000, 4),
                "ctr_pct":     round(m.ctr * 100, 4),
                "avg_cpc_usd": round(m.average_cpc / 1_000_000, 4),
            })
    except Exception as e:
        if "REQUESTED_METRICS_FOR_MANAGER" in str(e):
            return None
        print(f"WARNING: fetch_device_daily error for {customer_id}: {e}", file=sys.stderr)
    return rows


def fetch_demographics(service, customer_id: str, date_from: str, date_to: str) -> dict:
    """Gender and age breakdown, date-segmented per campaign."""
    result: dict[str, list] = {"gender": [], "age": []}

    try:
        for row in service.search(
            customer_id=customer_id,
            query=f"""
                SELECT
                    segments.date,
                    campaign.id,
                    campaign.name,
                    ad_group_criterion.gender.type,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros
                FROM gender_view
                WHERE segments.date BETWEEN '{date_from}' AND '{date_to}'
                  AND metrics.cost_micros > 0
            """,
        ):
            m = row.metrics
            result["gender"].append({
                "date":        str(row.segments.date),
                "gender":      row.ad_group_criterion.gender.type.name,
                "campaign_id": str(row.campaign.id),
                "impressions": int(m.impressions),
                "clicks":      int(m.clicks),
                "cost_usd":    round(m.cost_micros / 1_000_000, 4),
            })
    except Exception as e:
        print(f"WARNING: gender_view error for {customer_id}: {e}", file=sys.stderr)

    try:
        for row in service.search(
            customer_id=customer_id,
            query=f"""
                SELECT
                    segments.date,
                    campaign.id,
                    campaign.name,
                    ad_group_criterion.age_range.type,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros
                FROM age_range_view
                WHERE segments.date BETWEEN '{date_from}' AND '{date_to}'
                  AND metrics.cost_micros > 0
            """,
        ):
            m = row.metrics
            result["age"].append({
                "date":        str(row.segments.date),
                "age":         row.ad_group_criterion.age_range.type.name,
                "campaign_id": str(row.campaign.id),
                "impressions": int(m.impressions),
                "clicks":      int(m.clicks),
                "cost_usd":    round(m.cost_micros / 1_000_000, 4),
            })
    except Exception as e:
        print(f"WARNING: age_range_view error for {customer_id}: {e}", file=sys.stderr)

    return result


def main():
    today     = date.today()
    date_to   = str(today)
    date_from = "2020-01-01"   # fetch all available history

    default_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    client     = get_client()
    service    = client.get_service("GoogleAdsService")

    print(f"Connecting to account {default_id} ...")

    # Check whether default account is an MCC
    if is_manager_account(service, default_id):
        print(f"  → MCC detected")
        customer_ids = get_client_account_ids(service, default_id)
        if not customer_ids:
            print("ERROR: MCC has no enabled client sub-accounts.", file=sys.stderr)
            sys.exit(1)
        account = fetch_account_info(service, customer_ids[0])
        account["mcc_id"]     = default_id
        account["client_ids"] = customer_ids
    else:
        customer_ids = [default_id]
        account      = fetch_account_info(service, default_id)

    # Fetch all campaigns metadata (name/status/dates) regardless of period
    all_campaigns_meta = []
    for cid in customer_ids:
        meta = fetch_all_campaigns_meta(service, cid)
        if meta:
            all_campaigns_meta.extend(meta)
    print(f"Total campaigns in account: {len(all_campaigns_meta)}")
    for m in all_campaigns_meta:
        print(f"  [{m['status']}] {m['name']}")

    print(f"Fetching daily metrics {date_from} → {date_to} from account(s): {customer_ids}")

    # Merge daily data from all accounts
    merged: dict[str, dict] = defaultdict(dict)
    for cid in customer_ids:
        result = fetch_daily_campaigns(service, cid, date_from, date_to)
        if result is None:
            print(f"  SKIP {cid}: still returning MCC error", file=sys.stderr)
            continue
        total_days = sum(1 for v in result.values() if v)
        print(f"  Account {cid}: {total_days} days with data")
        for day, camps in result.items():
            merged[day].update(camps)

    # Find actual earliest day with data so daily array isn't bloated with empty years
    if merged:
        earliest_data = min(merged.keys())
        # Start 30 days before first data point, but never before date_from
        start_str = max(date_from,
                        str(date.fromisoformat(earliest_data) - timedelta(days=30)))
    else:
        start_str = str(today - timedelta(days=90))

    days_with_data = sum(1 for v in merged.values() if v)
    print(f"Total days with data: {days_with_data}  (from {start_str} → {date_to})")

    # Build daily array sorted newest-first
    daily_list = []
    cur   = today
    start = date.fromisoformat(start_str)
    while cur >= start:
        day_str = str(cur)
        camps   = list(merged[day_str].values()) if day_str in merged else []
        daily_list.append({"date": day_str, "campaigns": camps})
        cur -= timedelta(days=1)

    # Device breakdown (daily, per campaign)
    print("Fetching device breakdown ...")
    device_rows: list = []
    for cid in customer_ids:
        dr = fetch_device_daily(service, cid, start_str, date_to)
        if dr:
            device_rows.extend(dr)
    print(f"  Device rows: {len(device_rows)}")

    # Demographics (gender + age)
    print("Fetching demographics ...")
    demographics: dict = {"gender": [], "age": []}
    for cid in customer_ids:
        demo = fetch_demographics(service, cid, start_str, date_to)
        demographics["gender"].extend(demo.get("gender", []))
        demographics["age"].extend(demo.get("age", []))
    print(f"  Gender rows: {len(demographics['gender'])}  Age rows: {len(demographics['age'])}")

    result = {
        "status":            "ok",
        "fetched_at":        str(today),
        "period":            {"date_from": start_str, "date_to": date_to},
        "account":           account,
        "campaigns_meta":    all_campaigns_meta,
        "daily":             daily_list,
        "device_daily":      device_rows,
        "demographics":      demographics,
    }

    out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "hub", "data", "google", "ads_metrics.json",
    )
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Written → {out}")


if __name__ == "__main__":
    main()
