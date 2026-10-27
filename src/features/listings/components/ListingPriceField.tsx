import { Description, FieldError, I18nProvider, Label, NumberField } from "@heroui/react";
import { LISTING_CURRENCY_CODE } from "@/constants/app.constants";

const PRICE_STEP = 100;

type ListingPriceFieldProps = {
  readonly value: number;
  readonly error?: string;
  readonly showCurrencyChangeNote: boolean;
  readonly onChange: (value: number) => void;
};

function stepPrice(current: number, direction: 1 | -1): number {
  if (!Number.isFinite(current)) {
    return direction > 0 ? PRICE_STEP : 0;
  }
  const next = current + direction * PRICE_STEP;
  return Math.min(1_000_000, Math.max(0, next));
}

export function ListingPriceField({
  value,
  error,
  showCurrencyChangeNote,
  onChange,
}: ListingPriceFieldProps) {
  return (
    <I18nProvider locale="en-NG">
      <NumberField
        fullWidth
        formatOptions={{
          style: "currency",
          currency: LISTING_CURRENCY_CODE,
          currencyDisplay: "narrowSymbol",
          maximumFractionDigits: 2,
        }}
        isInvalid={Boolean(error)}
        maxValue={1_000_000}
        minValue={0}
        step={PRICE_STEP}
        value={value}
        onChange={onChange}
      >
        <Label className="text-lg font-semibold text-campus-ink">Price</Label>
        <NumberField.Group>
          <NumberField.DecrementButton
            onPress={() => {
              onChange(stepPrice(value, -1));
            }}
          />
          <NumberField.Input />
          <NumberField.IncrementButton
            onPress={() => {
              onChange(stepPrice(value, 1));
            }}
          />
        </NumberField.Group>
        <Description className="text-sm text-campus-ink">
          Nigerian naira only. Step the arrows or type an amount.
        </Description>
        {showCurrencyChangeNote ? (
          <Description>
            This listing used another currency. Saving it stores the amount as naira.
          </Description>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </NumberField>
    </I18nProvider>
  );
}
