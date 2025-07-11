import requests

ETHERSCAN_API_KEY = '6M1M5PP3XCAHETCHHUGM6HCQ2SS5Y1553N'

def get_eth_balance(address):
    url = f'https://api.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={ETHERSCAN_API_KEY}'
    res = requests.get(url).json()
    return int(res['result']) / 1e18 if res['status'] == '1' else 0

def get_token_balances(address):
    # Dummy tokens (replace with Moralis or Web3 later)
    return [
        {'symbol': 'USDT', 'balance': 50},
        {'symbol': 'DAI', 'balance': 100},
    ]
