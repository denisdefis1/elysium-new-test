from google.ads.googleads.client import GoogleAdsClient

CONFIG = "/Users/admin/elysium-new-test/elysium_setup/google-ads.yaml"

client = GoogleAdsClient.load_from_storage(CONFIG)

customer_id = "3341934882"

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
    print("SUCCESS")
    print("Customer ID:", row.customer.id)
    print("Name:", row.customer.descriptive_name)
    print("Currency:", row.customer.currency_code)
    print("Timezone:", row.customer.time_zone)
