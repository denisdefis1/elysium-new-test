import os
import asyncio
import json
import time
from typing import Optional

from dotenv import load_dotenv
from google.ads.googleads.client import GoogleAdsClient
from google.api_core import protobuf_helpers
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
    """Get all Google Ads campaigns and their current status.
    Automatically handles MCC manager accounts by querying all client sub-accounts."""

    client = get_client()
    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    service = client.get_service("GoogleAdsService")

    query = """
        SELECT
            customer.id,
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.serving_status,
            campaign.advertising_channel_type,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros
        FROM campaign
        ORDER BY campaign.id
    """

    def _query_account(cid):
        rows = []
        try:
            for row in service.search(customer_id=cid, query=query):
                cost = round(row.metrics.cost_micros / 1_000_000, 2)
                rows.append(
                    f"Account: {cid} | "
                    f"Campaign ID: {row.campaign.id} | "
                    f"Name: {row.campaign.name} | "
                    f"Status: {row.campaign.status.name} | "
                    f"Serving: {row.campaign.serving_status.name} | "
                    f"Impressions: {row.metrics.impressions} | "
                    f"Clicks: {row.metrics.clicks} | "
                    f"Cost: ${cost}"
                )
        except Exception as e:
            err = str(e)
            if "REQUESTED_METRICS_FOR_MANAGER" in err:
                return None  # signal: this is an MCC
            rows.append(f"Account {cid} error: {err}")
        return rows

    results = _query_account(customer_id)

    # If MCC account — discover and query all client sub-accounts
    if results is None:
        client_ids = _get_client_account_ids(client, customer_id)
        if not client_ids:
            return f"Account {customer_id} is a manager (MCC) with no enabled client accounts."
        results = []
        results.append(f"Manager account {customer_id} — querying {len(client_ids)} client account(s): {', '.join(client_ids)}")
        for cid in client_ids:
            sub = _query_account(cid)
            if sub:
                results.extend(sub)

    return "\n".join(results) if results else "No campaigns found in any account."


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
    Automatically handles MCC manager accounts by querying all client sub-accounts.

    Args:
        date_from: Start date in YYYY-MM-DD format (e.g. 2026-02-01)
        date_to:   End date in YYYY-MM-DD format (e.g. 2026-08-22)

    Returns JSON with per-campaign metrics (impressions, clicks, cost, CTR,
    avg CPC, conversions, CPL) plus account-level totals and metadata.
    """
    client = get_client()
    default_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    service = client.get_service("GoogleAdsService")

    campaign_query = f"""
        SELECT
            customer.id,
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

    def _query_campaigns(cid):
        rows = []
        for row in service.search(customer_id=cid, query=campaign_query):
            m = row.metrics
            cost = round(m.cost_micros / 1_000_000, 2)
            avg_cpc = round(m.average_cpc / 1_000_000, 2)
            cpl = round(m.cost_per_conversion / 1_000_000, 2) if m.conversions > 0 else None
            rows.append({
                "account_id": str(row.customer.id),
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
        return rows

    # Resolve target account(s) — handle MCC transparently
    campaigns = []
    account_info = {"id": default_id}
    client_ids_used = []

    try:
        campaigns = _query_campaigns(default_id)
        client_ids_used = [default_id]
    except Exception as e:
        if "REQUESTED_METRICS_FOR_MANAGER" in str(e):
            # MCC account — discover and query all client accounts
            client_ids = _get_client_account_ids(client, default_id)
            client_ids_used = client_ids
            account_info["mcc_id"] = default_id
            account_info["client_ids"] = client_ids
            for cid in client_ids:
                try:
                    campaigns.extend(_query_campaigns(cid))
                except Exception as sub_e:
                    campaigns.append({"error": f"Account {cid}: {str(sub_e)}"})
        else:
            campaigns = [{"error": str(e)}]

    # Fetch account info from first usable account
    for cid in client_ids_used:
        try:
            for row in service.search(customer_id=cid, query="""
                SELECT customer.id, customer.descriptive_name,
                       customer.currency_code, customer.time_zone
                FROM customer LIMIT 1
            """):
                account_info.update({
                    "id": str(row.customer.id),
                    "name": row.customer.descriptive_name,
                    "currency": row.customer.currency_code,
                    "timezone": row.customer.time_zone,
                })
            break
        except Exception:
            pass

    # Sort by cost desc, compute totals
    campaigns.sort(key=lambda c: c.get("cost_usd", 0), reverse=True)
    clean = [c for c in campaigns if "error" not in c]
    total_imp  = sum(c["impressions"] for c in clean)
    total_clk  = sum(c["clicks"]      for c in clean)
    total_cost = round(sum(c["cost_usd"] for c in clean), 2)
    total_conv = round(sum(c["conversions"] for c in clean), 2)

    result = {
        "status": "ok",
        "fetched_at": date_to,
        "period": {"date_from": date_from, "date_to": date_to},
        "mcc_id": default_id,
        "account": account_info,
        "campaigns": campaigns,
        "totals": {
            "impressions": total_imp,
            "clicks":      total_clk,
            "cost_usd":    total_cost,
            "ctr_pct":     round(total_clk / total_imp * 100, 3) if total_imp > 0 else 0,
            "avg_cpc_usd": round(total_cost / total_clk, 2)      if total_clk > 0 else 0,
            "conversions": total_conv,
            "cpl_usd":     round(total_cost / total_conv, 2)     if total_conv > 0 else None,
        },
    }
    return json.dumps(result, ensure_ascii=False, indent=2)


def _resolve_customer_id(client, override: Optional[str] = None) -> str:
    """Return the operative (non-MCC) customer ID to use for mutations."""
    default = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
    if override:
        return override
    try:
        ids = _get_client_account_ids(client, default)
        return ids[0] if ids else default
    except Exception:
        return default


@mcp.tool()
async def create_campaign_budget(
    name: str,
    amount_usd: float,
    customer_id: Optional[str] = None,
) -> str:
    """Create a shared campaign budget.

    Args:
        name: Budget name, e.g. "К1 — Purchase RU Budget"
        amount_usd: Daily budget in USD, e.g. 4.2
        customer_id: Optional client account ID override

    Returns JSON with budget_id and resource_name — pass budget_id to create_campaign.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("CampaignBudgetService")

    op = client.get_type("CampaignBudgetOperation")
    b = op.create
    b.name = name
    b.amount_micros = int(amount_usd * 1_000_000)
    b.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD

    try:
        resp = service.mutate_campaign_budgets(customer_id=cid, operations=[op])
        rn = resp.results[0].resource_name
        return json.dumps({
            "status": "ok",
            "budget_id": rn.split("/")[-1],
            "resource_name": rn,
            "name": name,
            "amount_usd": amount_usd,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def create_campaign(
    name: str,
    budget_id: str,
    geo_target_ids: Optional[str] = "2804,2376,2612",
    language_ids: Optional[str] = "1031",
    customer_id: Optional[str] = None,
) -> str:
    """Create a Search campaign in PAUSED status with geo and language targeting.

    Geo target IDs (comma-separated):
      2804=Ukraine  2376=Israel  2612=Belarus
      2268=Georgia  2643=Russia  2840=US  2826=UK

    Language IDs (comma-separated):
      1031=Russian  1000=English  1082=Georgian

    Args:
        name: Campaign name, e.g. "К1 — Purchase RU"
        budget_id: ID returned by create_campaign_budget
        geo_target_ids: Comma-separated geo criterion IDs (default: Ukraine+Israel+Belarus)
        language_ids: Comma-separated language constant IDs (default: Russian)
        customer_id: Optional client account ID override

    Returns JSON with campaign_id — pass to create_ad_group and add_* tools.
    Campaign is created in PAUSED status. Use enable_campaign to go live.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    camp_service = client.get_service("CampaignService")
    crit_service = client.get_service("CampaignCriterionService")

    op = client.get_type("CampaignOperation")
    c = op.create
    c.name = name
    c.status = client.enums.CampaignStatusEnum.PAUSED
    c.advertising_channel_type = client.enums.AdvertisingChannelTypeEnum.SEARCH
    c.campaign_budget = f"customers/{cid}/campaignBudgets/{budget_id}"
    c.manual_cpc.enhanced_cpc_enabled = False
    c.network_settings.target_google_search = True
    c.network_settings.target_search_network = True
    c.network_settings.target_content_network = False

    try:
        resp = camp_service.mutate_campaigns(customer_id=cid, operations=[op])
        camp_rn = resp.results[0].resource_name
        camp_id = camp_rn.split("/")[-1]

        # Add geo targets
        geo_ops = []
        for geo_id in [g.strip() for g in (geo_target_ids or "").split(",") if g.strip()]:
            gop = client.get_type("CampaignCriterionOperation")
            g = gop.create
            g.campaign = camp_rn
            g.location.geo_target_constant = f"geoTargetConstants/{geo_id}"
            geo_ops.append(gop)
        if geo_ops:
            crit_service.mutate_campaign_criteria(customer_id=cid, operations=geo_ops)

        # Add language targets
        lang_ops = []
        for lang_id in [l.strip() for l in (language_ids or "").split(",") if l.strip()]:
            lop = client.get_type("CampaignCriterionOperation")
            l = lop.create
            l.campaign = camp_rn
            l.language.language_constant = f"languageConstants/{lang_id}"
            lang_ops.append(lop)
        if lang_ops:
            crit_service.mutate_campaign_criteria(customer_id=cid, operations=lang_ops)

        return json.dumps({
            "status": "ok",
            "campaign_id": camp_id,
            "resource_name": camp_rn,
            "name": name,
            "campaign_status": "PAUSED",
            "geo_target_ids": geo_target_ids,
            "language_ids": language_ids,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def create_ad_group(
    name: str,
    campaign_id: str,
    cpc_bid_usd: Optional[float] = 0.50,
    customer_id: Optional[str] = None,
) -> str:
    """Create an ad group inside a campaign.

    Args:
        name: Ad group name, e.g. "Покупка апартаментов — Тбилиси"
        campaign_id: Campaign ID returned by create_campaign
        cpc_bid_usd: Default max CPC bid in USD (default 0.50)
        customer_id: Optional client account ID override

    Returns JSON with ad_group_id — pass to create_rsa_ad and add_keywords.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("AdGroupService")

    op = client.get_type("AdGroupOperation")
    ag = op.create
    ag.name = name
    ag.campaign = f"customers/{cid}/campaigns/{campaign_id}"
    ag.status = client.enums.AdGroupStatusEnum.ENABLED
    ag.cpc_bid_micros = int((cpc_bid_usd or 0.50) * 1_000_000)

    try:
        resp = service.mutate_ad_groups(customer_id=cid, operations=[op])
        rn = resp.results[0].resource_name
        return json.dumps({
            "status": "ok",
            "ad_group_id": rn.split("/")[-1],
            "resource_name": rn,
            "name": name,
            "campaign_id": campaign_id,
            "cpc_bid_usd": cpc_bid_usd,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def create_rsa_ad(
    ad_group_id: str,
    campaign_id: str,
    headlines_json: str,
    descriptions_json: str,
    final_url: str,
    customer_id: Optional[str] = None,
) -> str:
    """Create a Responsive Search Ad (RSA) in an ad group.

    Args:
        ad_group_id: Ad group ID from create_ad_group
        campaign_id: Campaign ID (needed to build the resource name)
        headlines_json: JSON array of headline objects, e.g.:
            [{"text": "Бутик-резиденция Тбилиси", "pin": "P1"},
             {"text": "Апартаменты от 130 м²", "pin": null}]
            Pins: "P1", "P2", "P3" or null. Max 15 headlines, max 30 chars each.
        descriptions_json: JSON array of description objects, e.g.:
            [{"text": "Бутик-резиденция — комфорт и приватность.", "pin": null}]
            Max 4 descriptions, max 90 chars each.
        final_url: Landing page URL, e.g. "https://elysiumtbilisi.com/?lang=ru"
        customer_id: Optional client account ID override

    Returns JSON with ad_id on success.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("AdGroupAdService")

    PIN_MAP = {
        "P1": client.enums.ServedAssetFieldTypeEnum.HEADLINE_1,
        "P2": client.enums.ServedAssetFieldTypeEnum.HEADLINE_2,
        "P3": client.enums.ServedAssetFieldTypeEnum.HEADLINE_3,
        "D1": client.enums.ServedAssetFieldTypeEnum.DESCRIPTION_1,
        "D2": client.enums.ServedAssetFieldTypeEnum.DESCRIPTION_2,
    }

    try:
        headlines = json.loads(headlines_json)
        descriptions = json.loads(descriptions_json)
    except Exception as e:
        return json.dumps({"status": "error", "error": f"JSON parse error: {e}"}, ensure_ascii=False, indent=2)

    op = client.get_type("AdGroupAdOperation")
    aga = op.create
    aga.ad_group = f"customers/{cid}/adGroups/{ad_group_id}"
    aga.status = client.enums.AdGroupAdStatusEnum.ENABLED
    aga.ad.final_urls.append(final_url)

    for h in headlines:
        asset = client.get_type("AdTextAsset")
        asset.text = h["text"]
        pin = h.get("pin")
        if pin and pin in PIN_MAP:
            asset.pinned_field = PIN_MAP[pin]
        aga.ad.responsive_search_ad.headlines.append(asset)

    for d in descriptions:
        asset = client.get_type("AdTextAsset")
        asset.text = d["text"]
        pin = d.get("pin")
        if pin and pin in PIN_MAP:
            asset.pinned_field = PIN_MAP[pin]
        aga.ad.responsive_search_ad.descriptions.append(asset)

    try:
        resp = service.mutate_ad_group_ads(customer_id=cid, operations=[op])
        rn = resp.results[0].resource_name
        return json.dumps({
            "status": "ok",
            "ad_id": rn.split("/")[-1],
            "resource_name": rn,
            "ad_group_id": ad_group_id,
            "final_url": final_url,
            "headlines_count": len(headlines),
            "descriptions_count": len(descriptions),
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def add_keywords(
    ad_group_id: str,
    campaign_id: str,
    keywords_json: str,
    customer_id: Optional[str] = None,
) -> str:
    """Add keywords to an ad group.

    Args:
        ad_group_id: Ad group ID from create_ad_group
        campaign_id: Campaign ID (used to build resource name)
        keywords_json: JSON array of keyword objects, e.g.:
            [{"text": "купить апартаменты тбилиси", "match_type": "EXACT"},
             {"text": "недвижимость тбилиси", "match_type": "PHRASE"}]
            match_type: "EXACT", "PHRASE", or "BROAD"
        customer_id: Optional client account ID override

    Returns JSON with count of added keywords.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("AdGroupCriterionService")

    MATCH_TYPES = {
        "EXACT":  client.enums.KeywordMatchTypeEnum.EXACT,
        "PHRASE": client.enums.KeywordMatchTypeEnum.PHRASE,
        "BROAD":  client.enums.KeywordMatchTypeEnum.BROAD,
    }

    try:
        keywords = json.loads(keywords_json)
    except Exception as e:
        return json.dumps({"status": "error", "error": f"JSON parse error: {e}"}, ensure_ascii=False, indent=2)

    ops = []
    for kw in keywords:
        op = client.get_type("AdGroupCriterionOperation")
        c = op.create
        c.ad_group = f"customers/{cid}/adGroups/{ad_group_id}"
        c.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
        c.keyword.text = kw["text"]
        c.keyword.match_type = MATCH_TYPES.get(kw.get("match_type", "EXACT").upper(), MATCH_TYPES["EXACT"])
        ops.append(op)

    try:
        resp = service.mutate_ad_group_criteria(customer_id=cid, operations=ops)
        return json.dumps({
            "status": "ok",
            "added": len(resp.results),
            "ad_group_id": ad_group_id,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def add_campaign_negative_keywords(
    campaign_id: str,
    keywords_json: str,
    customer_id: Optional[str] = None,
) -> str:
    """Add negative keywords at the campaign level.

    Args:
        campaign_id: Campaign ID from create_campaign
        keywords_json: JSON array, e.g.:
            [{"text": "студия", "match_type": "BROAD"},
             {"text": "аренда", "match_type": "BROAD"}]
        customer_id: Optional client account ID override

    Returns JSON with count of added negative keywords.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("CampaignCriterionService")

    MATCH_TYPES = {
        "EXACT":  client.enums.KeywordMatchTypeEnum.EXACT,
        "PHRASE": client.enums.KeywordMatchTypeEnum.PHRASE,
        "BROAD":  client.enums.KeywordMatchTypeEnum.BROAD,
    }

    try:
        keywords = json.loads(keywords_json)
    except Exception as e:
        return json.dumps({"status": "error", "error": f"JSON parse error: {e}"}, ensure_ascii=False, indent=2)

    ops = []
    for kw in keywords:
        op = client.get_type("CampaignCriterionOperation")
        c = op.create
        c.campaign = f"customers/{cid}/campaigns/{campaign_id}"
        c.negative = True
        c.keyword.text = kw["text"]
        c.keyword.match_type = MATCH_TYPES.get(kw.get("match_type", "BROAD").upper(), MATCH_TYPES["BROAD"])
        ops.append(op)

    try:
        resp = service.mutate_campaign_criteria(customer_id=cid, operations=ops)
        return json.dumps({
            "status": "ok",
            "added": len(resp.results),
            "campaign_id": campaign_id,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def add_sitelinks(
    campaign_id: str,
    sitelinks_json: str,
    customer_id: Optional[str] = None,
) -> str:
    """Add sitelink assets to a campaign.

    Args:
        campaign_id: Campaign ID from create_campaign
        sitelinks_json: JSON array of sitelink objects, e.g.:
            [{"text": "Планировки и цены",
              "description1": "Свободная планировка от 130 м²",
              "description2": "Подземный паркинг включён",
              "final_url": "https://elysiumtbilisi.com/?lang=ru#plans"}]
            text max 25 chars, description1/2 max 35 chars each.
        customer_id: Optional client account ID override

    Returns JSON with count of added sitelinks.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    asset_service = client.get_service("AssetService")
    camp_asset_service = client.get_service("CampaignAssetService")

    try:
        sitelinks = json.loads(sitelinks_json)
    except Exception as e:
        return json.dumps({"status": "error", "error": f"JSON parse error: {e}"}, ensure_ascii=False, indent=2)

    try:
        added = []
        for sl in sitelinks:
            # Create sitelink asset
            asset_op = client.get_type("AssetOperation")
            a = asset_op.create
            a.sitelink_asset.link_text = sl["text"]
            a.sitelink_asset.description1 = sl.get("description1", "")
            a.sitelink_asset.description2 = sl.get("description2", "")
            if sl.get("final_url"):
                a.final_urls.append(sl["final_url"])

            asset_resp = asset_service.mutate_assets(customer_id=cid, operations=[asset_op])
            asset_rn = asset_resp.results[0].resource_name

            # Link asset to campaign
            ca_op = client.get_type("CampaignAssetOperation")
            ca = ca_op.create
            ca.asset = asset_rn
            ca.campaign = f"customers/{cid}/campaigns/{campaign_id}"
            ca.field_type = client.enums.AssetFieldTypeEnum.SITELINK
            camp_asset_service.mutate_campaign_assets(customer_id=cid, operations=[ca_op])

            added.append({"text": sl["text"], "asset_resource_name": asset_rn})

        return json.dumps({
            "status": "ok",
            "added": len(added),
            "sitelinks": added,
            "campaign_id": campaign_id,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


@mcp.tool()
async def enable_campaign(
    campaign_id: str,
    customer_id: Optional[str] = None,
) -> str:
    """Enable a campaign (PAUSED → ENABLED). This starts spending the budget.

    IMPORTANT: Only call this after verifying all campaign settings in Google Ads UI.
    Campaigns created by create_campaign start in PAUSED status for safety.

    Args:
        campaign_id: Campaign ID to enable
        customer_id: Optional client account ID override

    Returns JSON confirming the status change.
    """
    client = get_client()
    cid = _resolve_customer_id(client, customer_id)
    service = client.get_service("CampaignService")

    op = client.get_type("CampaignOperation")
    c = op.update
    c.resource_name = f"customers/{cid}/campaigns/{campaign_id}"
    c.status = client.enums.CampaignStatusEnum.ENABLED

    client.copy_from(op.update_mask, protobuf_helpers.field_mask(None, c._pb))

    try:
        resp = service.mutate_campaigns(customer_id=cid, operations=[op])
        return json.dumps({
            "status": "ok",
            "campaign_id": campaign_id,
            "new_status": "ENABLED",
            "resource_name": resp.results[0].resource_name,
            "customer_id": cid,
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    asyncio.run(mcp.run_stdio_async())
