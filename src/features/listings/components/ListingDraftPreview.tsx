import { LISTING_CURRENCY_CODE } from "@/constants/app.constants";
import { CONDITION_LABELS } from "@/constants/listing.constants";
import type { ListingDraft } from "@/features/listings/types/listing.interfaces";
import { formatMoney } from "@/utils/currency.utils";

type ListingDraftPreviewProps = {
  readonly draft: ListingDraft;
};

export function ListingDraftPreview({ draft }: ListingDraftPreviewProps) {
  const cover = draft.photoUrls[0];
  const title = draft.title.trim().length > 0 ? draft.title.trim() : "Add a title";
  const place = draft.locationLabel.trim().length > 0 ? draft.locationLabel.trim() : "Add a location";
  const category = draft.categoryName.trim().length > 0 ? draft.categoryName.trim() : "Category";
  const priceLabel = Number.isFinite(draft.price)
    ? formatMoney(draft.price, LISTING_CURRENCY_CODE, "en-NG")
    : "Set a naira price";

  return (
    <aside aria-label="Listing preview" className="lg:sticky lg:top-32">
      <h2 className="font-display text-3xl tracking-tight text-campus-ink">Preview</h2>
      <p className="mt-2 mb-5 max-w-[36ch] text-sm leading-relaxed text-campus-ink/75">
        Buyers see this card while browsing. The first photo is the cover.
      </p>
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_-36px_oklch(0.22_0.04_255/0.7)]">
        <div className="relative aspect-[4/5] bg-campus-mist">
          {cover ? (
            <img alt="" className="size-full object-cover" height={480} src={cover} width={360} />
          ) : (
            <div className="flex size-full items-end p-4">
              <p className="font-display text-2xl text-campus-ink">Add a photo</p>
            </div>
          )}
          <p className="absolute bottom-3 left-3 rounded-full bg-campus-paper px-3 py-1 text-sm font-semibold tabular-nums text-campus-ink">
            {priceLabel}
          </p>
        </div>
        <div className="space-y-2 px-4 py-4">
          <h3 className="font-display text-xl leading-snug tracking-tight text-campus-ink">{title}</h3>
          <p className="text-sm text-campus-ink/75">
            {category} · {place}
          </p>
          <p className="text-sm text-campus-ink/75">{CONDITION_LABELS[draft.condition]}</p>
          {draft.photoUrls.length > 1 ? (
            <p className="text-sm tabular-nums text-campus-ink/75">{draft.photoUrls.length} photos</p>
          ) : null}
        </div>
      </article>
    </aside>
  );
}
