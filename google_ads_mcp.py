import os
from dotenv import load_dotenv
from google.ads.googleads.client import GoogleAdsClient
from mcp.server.fastmcp import FastMCP

load_dotenv()

mcp = FastMCP("Elysium Google Ads")

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

@mcp.tool()
def get_customer_info() -> str:
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
def get_campaigns() -> str:
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

if __name__ == "__main__":
    mcp.run(transport="stdio")
