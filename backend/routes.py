from flask import Blueprint, request, jsonify
from .utils import get_eth_balance, get_token_balances
from .models import Portfolio
from . import db
import json, re


main = Blueprint('main', __name__)

@main.route('/track', methods=['POST'])
def track_wallet():
    data = request.get_json()
    address = data.get('wallet')

    if not is_valid_ethereum_address(address):
        return jsonify({'error': 'Invalid Ethereum address'}), 400

    eth_balance = get_eth_balance(address)
    tokens = get_token_balances(address)

    token_data = json.dumps(tokens)
    portfolio = Portfolio(wallet_address=address, eth_balance=eth_balance, tokens=token_data)
    db.session.add(portfolio)
    db.session.commit()

    return jsonify({
        'wallet': address,
        'eth_balance': eth_balance,
        'tokens': tokens
    })

@main.route('/history/<wallet>', methods=['GET'])
def get_history(wallet):
    if not is_valid_ethereum_address(wallet):
        return jsonify({'error': 'Invalid Ethereum address'}), 400

    entries = Portfolio.query.filter_by(wallet_address=wallet).order_by(Portfolio.timestamp.desc()).all()
    history = [
        {
            'eth_balance': entry.eth_balance,
            'tokens': json.loads(entry.tokens),
            'timestamp': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for entry in entries
    ]
    return jsonify(history)

def is_valid_ethereum_address(address):
    pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
    return bool(pattern.match(address))
