from decimal import Decimal, ROUND_HALF_EVEN


def round_currency(amount: Decimal, places: int = 2) -> Decimal:
    quantizer = Decimal(10) ** -places
    return amount.quantize(quantizer, rounding=ROUND_HALF_EVEN)


def round_4dp(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.0001"), rounding=ROUND_HALF_EVEN)
