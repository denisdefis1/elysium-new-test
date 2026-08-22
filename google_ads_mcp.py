import os
import asyncio
import json
import time
from typing import Optional

from dotenv import load_dotenv
from google.ads.googleads.client import GoogleAdsClient
from mcp.server.mcpserver import MCPServer

load_dotenv()

mcp = MCPServer("Elysium Google Ads")


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


def _get_client_account_ids(client, manager_customer_id: str) -> list[str]:
    """Return IDs of non-manager client accounts under a manager (MCC) account."""
    service = client.get_service("GoogleAdsService")
    query = """
        SELECT
            customer_client.id,
            customer_client.manager,
            customer_client.status
        FROM customer_client
        WHERE customer_client.status = 'ENABLED'
          AND customer_client.manager = false
    """
    response = service.search(customer_id=manager_customer_id, query=query)
    return [str(row.customer_client.id) for row in response]


def _build_keyword_row(row) -> dict:
    """Convert a GAQL keyword_view row into a clean metrics dict."""
    m = row.metrics
    crit = row.ad_group_criterion

    cost = m.cost_micros / 1_000_000
    avg_cpc = m.average_cpc / 1_000_000
    cost_per_conv = m.cost_per_conversion / 1_000_000

    qs = crit.quality_info.quality_score
    sis = m.search_impression_share
    top_is = m.search_top_impression_share
    abs_top_is = m.search_absolute_top_impression_share

    return {
        "campaign_id": row.campaign.id,
        "campaign_name": row.campaign.name,
        "ad_group_id": row.ad_group.id,
        "ad_group_name": row.ad_group.name,
        "keyword": crit.keyword.text,
        "match_type": crit.keyword.match_type.name,
        "status": crit.status.name,
        "quality_score": qs if qs > 0 else None,
        "impressions": m.impressions,
        "clicks": m.clicks,
        "cost": round(cost, 2),
        "ctr": round(m.ctr * 100, 4),
        "average_cpc": round(avg_cpc, 2),
        "conversions": round(m.conversions, 2),
        "cost_per_conversion": round(cost_per_conv, 2),
        "all_conversions": round(m.all_conversions, 2),
        "search_impression_share": round(sis * 100, 2) if sis > 0 else None,
        "search_top_impression_share": round(top_is * 100, 2) if top_is > 0 else None,
        "search_abs_top_impression_share": round(abs_top_is * 100, 2) if abs_top_is > 0 else None,
    }


@mcp.tool()
async def get_customer_info() -> str:
    """Get basic information about the Google Ads customer."""

    client = get_client()
    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]

    service = client.get_service("GoogleAdsService")

    query = """
        SELECT
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            customer.time_zone
        FROM customer
        LIMIT 1
    """

    response = service.search(
        customer_id=customer_id,
        query=query,
    )

    for row in response:
        return (
            f"Customer ID: {row.customer.id}\n"
            f"Name: {row.customer.descriptive_name}\n"
            f"Currency: {row.customer.currency_code}\n"
            f"Timezone: {row.customer.time_zone}"
        )

    return "Customer not found."


@mcp.tool()
async def get_campaigns() -> str:
    """Get all Google Ads campaigns and their current status."""

    client = get_client()
    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]

    service = client.get_service("GoogleAdsService")

    query = """
        SELECT
            campaign.id,
            campaign.name,
            campaign.status
        FROM campaign
        ORDER BY campaign.id
    """

    response = service.search(
        customer_id=customer_id,
        query=query,
    )

    results = []

    for row in response:
        results.append(
            f"ID: {row.campaign.id} | "
            f"Name: {row.campaign.name} | "
            f"Status: {row.campaign.status.name}"
        )

    return "\n".join(results) if results else "No campaigns found."


@mcp.tool()
async def get_keyword_metrics(
    date_from: str,
    date_to: str,
    campaign_id: Optional[str] = None,
    limit: Optional[int] = 1000,
    client_customer_id: Optional[str] = None,
) -> str:
    """Get keyword performance metrics from Google Ads for a given date range.

    Automatically handles MCC (manager) accounts by querying all client sub-accounts.

    Args:
        date_from: Start date in YYYY-MM-DD format (e.g. 2025-01-01)
        date_to: End date in YYYY-MM-DD format (e.g. 2025-01-31)
        campaign_id: Optional campaign ID to filter results to a single campaign
        limit: Maximum number of rows to return (default 1000, max 10000)
        client_customer_id: Optional specific client account ID to query.
            If omitted, uses GOOGLE_ADS_CUSTOMER_ID; if that is a manager account,
            automatically discovers and queries all enabled client sub-accounts.

    Returns JSON with keyword metrics: clicks, impressions, cost, CTR, CPC,
    conversions, CPA, quality score, search impression share, match type, status.
    """
    client = get_client()
    service = client.get_service("GoogleAdsService")
    default_customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]

    where_clauses = [f"segments.date BETWEEN '{date_from}' AND '{date_to}'"]
    if campaign_id:
        where_clauses.append(f"campaign.id = {campaign_id}")

    where_str = " AND ".join(where_clauses)
    limit_int = max(1, min(int(limit or 1000), 10000))

    query = f"""
        SELECT
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group.name,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            ad_group_criterion.quality_info.quality_score,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.ctr,
            metrics.average_cpc,
            metrics.conversions,
            metrics.cost_per_conversion,
            metrics.all_conversions,
            metrics.search_impression_share,
            metrics.search_top_impression_share,
            metrics.search_absolute_top_impression_share
        FROM keyword_view
        WHERE {where_str}
        ORDER BY metrics.impressions DESC
        LIMIT {limit_int}
    """

    try:
        # Determine which customer ID(s) to query
        if client_customer_id:
            target_ids = [client_customer_id]
        else:
            target_ids = [default_customer_id]

        results = []
        errors = []

        for cid in target_ids:
            try:
                response = service.search(customer_id=cid, query=query)
                for row in response:
                    results.append(_build_keyword_row(row))
            except Exception as sub_err:
                err_str = str(sub_err)
                # If this is a manager account, auto-discover client accounts
                if "REQUESTED_METRICS_FOR_MANAGER" in err_str:
                    client_ids = _get_client_account_ids(client, cid)
                    if not client_ids:
                        errors.append(f"Customer {cid} is a manager account with no enabled client accounts.")
                        continue
                    for client_id in client_ids:
                        try:
                            sub_response = service.search(customer_id=client_id, query=query)
                            for row in sub_response:
                                results.append(_build_keyword_row(row))
                        except Exception as client_err:
                            errors.append(f"Customer {client_id}: {str(client_err)}")
                else:
                    errors.append(f"Customer {cid}: {err_str}")

        # Sort aggregated results by impressions desc and apply limit
        results.sort(key=lambda x: x["impressions"], reverse=True)
        results = results[:limit_int]

        output = {
            "status": "ok",
            "period": {"date_from": date_from, "date_to": date_to},
            "total": len(results),
            "keywords": results,
        }
        if errors:
            output["warnings"] = errors
        if not results:
            output["message"] = f"No keyword data found for period {date_from} to {date_to}."

        return json.dumps(output, ensure_ascii=False, indent=2)

    except Exception as e:
        return json.dumps({
            "status": "error",
            "error": str(e),
        }, ensure_ascii=False, indent=2)


@mcp.tool()
async def get_keyword_ideas(
    keywords: str,
    geo_target_ids: Optional[str] = "2268",
    language_id: Optional[str] = "1031",
    url: Optional[str] = None,
    limit: Optional[int] = 100,
    client_customer_id: Optional[str] = None,
    include_monthly_breakdown: Optional[bool] = False,
) -> str:
    """Get keyword ideas and search volume data from Google Ads Keyword Planner.

    Geo target IDs (use comma-separated for multiple):
      2268  = Georgia (country)        1007469 = Tbilisi
      2643  = Russia                   2804    = Ukraine
      2840  = United States            2826    = United Kingdom
      2376  = Israel

    Language IDs:
      1031 = Russian   1000 = English   1082 = Georgian

    Args:
        keywords: Comma-separated seed keywords. Example:
                  "купить квартиру тбилиси, недвижимость грузия"
        geo_target_ids: Comma-separated geo target criterion IDs (default: 2268 = Georgia)
        language_id: Language constant ID (default: 1031 = Russian)
        url: Optional URL seed (landing page). Used together with keywords or standalone.
        limit: Max keyword ideas to return (default 100, max 1000)
        client_customer_id: Override client account ID (optional; default: auto-detect)
        include_monthly_breakdown: If True, include month-by-month search volumes
                                   (makes response larger)

    Returns JSON with:
      keyword, avg_monthly_searches, competition (LOW/MEDIUM/HIGH),
      competition_index (0-100), low_top_of_page_bid, high_top_of_page_bid,
      monthly_search_volumes (if include_monthly_breakdown=True), close_variants.
    """
    client = get_client()
    kp_service = client.get_service("KeywordPlanIdeaService")

    # Resolve customer ID
    if client_customer_id:
        cid = client_customer_id
    else:
        default_cid = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
        # If default is manager, find first client account
        try:
            client_ids = _get_client_account_ids(client, default_cid)
            cid = client_ids[0] if client_ids else default_cid
        except Exception:
            cid = default_cid

    # Parse inputs
    seed_keywords = [k.strip() for k in keywords.split(",") if k.strip()]
    geo_ids = [g.strip() for g in (geo_target_ids or "2268").split(",") if g.strip()]
    lang_id = (language_id or "1031").strip()
    limit_int = max(1, min(int(limit or 100), 1000))

    def build_request():
        req = client.get_type("GenerateKeywordIdeasRequest")
        req.customer_id = cid
        req.language = f"languageConstants/{lang_id}"
        req.geo_target_constants = [f"geoTargetConstants/{g}" for g in geo_ids]
        req.include_adult_keywords = False
        req.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
        req.page_size = min(limit_int, 1000)
        if url and seed_keywords:
            req.keyword_and_url_seed.keywords.extend(seed_keywords)
            req.keyword_and_url_seed.url = url
        elif url:
            req.url_seed.url = url
        else:
            req.keyword_seed.keywords.extend(seed_keywords)
        return req

    # Execute with retry on rate limit
    max_attempts = 4
    last_error = None
    for attempt in range(max_attempts):
        if attempt > 0:
            wait_secs = 15 * attempt
            time.sleep(wait_secs)
        try:
            resp = kp_service.generate_keyword_ideas(request=build_request())
            results = []
            for idea in resp:
                m = idea.keyword_idea_metrics
                monthly = []
                if include_monthly_breakdown:
                    for mv in m.monthly_search_volumes:
                        monthly.append({
                            "year": mv.year,
                            "month": mv.month.name,
                            "searches": mv.monthly_searches,
                        })
                close_vars = list(idea.close_variants) if hasattr(idea, "close_variants") else []
                results.append({
                    "keyword": idea.text,
                    "avg_monthly_searches": m.avg_monthly_searches,
                    "competition": m.competition.name,
                    "competition_index": m.competition_index,
                    "low_top_of_page_bid": round(m.low_top_of_page_bid_micros / 1e6, 2),
                    "high_top_of_page_bid": round(m.high_top_of_page_bid_micros / 1e6, 2),
                    "monthly_search_volumes": monthly if include_monthly_breakdown else [],
                    "close_variants": close_vars,
                })
                if len(results) >= limit_int:
                    break

            results.sort(key=lambda x: x["avg_monthly_searches"], reverse=True)

            return json.dumps({
                "status": "ok",
                "params": {
                    "keywords": seed_keywords,
                    "url": url,
                    "geo_target_ids": geo_ids,
                    "language_id": lang_id,
                    "customer_id": cid,
                },
                "total": len(results),
                "ideas": results,
            }, ensure_ascii=False, indent=2)

        except Exception as e:
            last_error = str(e)
            if "429" in last_error or "exhausted" in last_error.lower():
                if attempt < max_attempts - 1:
                    continue
            break

    return json.dumps({
        "status": "error",
        "error": last_error,
        "hint": (
            "If error is 429/quota exhausted: the Keyword Planner API has strict rate limits. "
            "Wait a few minutes and retry. "
            "If INVALID_VALUE on 'language': verify language_id (1031=Russian, 1000=English, 1082=Georgian). "
            "If INVALID_VALUE on 'geo_target_constants': verify geo_target_ids (2268=Georgia, 2643=Russia, 2840=US)."
        ),
    }, ensure_ascii=False, indent=2)


@mcp.tool()
async def get_account_summary(
    date_from: str,
    date_to: str,
) -> str:
    """Get campaign-level performance summary for the Google Ads account.

    Args:
        date_from: Start date in YYYY-MM-DD format (e.g. 2026-02-01)
        date_to:   End date in YYYY-MM-DD format (e.g. 2026-08-22)

    Returns JSON with per-campaign metrics (impressions, clicks, cost, CTR,
    avg CPC, conversions, CPL) plus account-level totals and metadata.
    """
    client = get_client()
    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    service = client.get_service("GoogleAdsService")

    # Account info
    account_query = """
        SELECT
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            customer.time_zone
        FROM customer LIMIT 1
    """
    account_info = {}
    try:
        for row in service.search(customer_id=customer_id, query=account_query):
            account_info = {
                "id": str(row.customer.id),
                "name": row.customer.descriptive_name,
                "currency": row.customer.currency_code,
                "timezone": row.customer.time_zone,
            }
    except Exception as e:
        account_info = {"error": str(e)}

    # Campaign metrics
    campaign_query = f"""
        SELECT
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
        ORDER BY metrics.cost_micros DESC
    """

    campaigns = []
    try:
        for row in service.search(customer_id=customer_id, query=campaign_query):
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
        campaigns = [{"error": str(e)}]

    # Totals
    total_impressions = sum(c.get("impressions", 0) for c in campaigns if "error" not in c)
    total_clicks = sum(c.get("clicks", 0) for c in campaigns if "error" not in c)
    total_cost = round(sum(c.get("cost_usd", 0) for c in campaigns if "error" not in c), 2)
    total_conv = round(sum(c.get("conversions", 0) for c in campaigns if "error" not in c), 2)
    blended_ctr = round(total_clicks / total_impressions * 100, 3) if total_impressions > 0 else 0
    blended_cpl = round(total_cost / total_conv, 2) if total_conv > 0 else None

    result = {
        "status": "ok",
        "fetched_at": date_to,
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
    return json.dumps(result, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    asyncio.run(mcp.run_stdio_async())
