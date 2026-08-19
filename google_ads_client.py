import os
from dotenv import load_dotenv
from google.ads.googleads.client import GoogleAdsClient

load_dotenv()

CONFIG = {
    "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
    "client_id": os.environ["GOOGLE_ADS_CLIENT_ID"],
    "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"],
    "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
    "login_customer_id": os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
    "use_proto_plus": True,
}

def get_client():
    return GoogleAdsClient.load_from_dict(CONFIG)

def get_customer_id():
    return os.environ["GOOGLE_ADS_CUSTOMER_ID"]
