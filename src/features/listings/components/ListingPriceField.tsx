import { Description, FieldError, I18nProvider, Label, NumberField } from "@heroui/react";
import { LISTING_CURRENCY_CODE } from "@/constants/app.constants";

type ListingPriceFieldProps = {
  readonly value: number;
  readonly error?: string;
  readonly showCurrencyChangeNote: boolean;
  readonly onChange: (value: number) => void;
};

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
        step={100}
        value={value}
        onChange={onChange}
      >
        <Label className="text-lg font-semibold text-campus-ink">Price</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>Nigerian naira only. Step the arrows or type an amount.</Description>
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
