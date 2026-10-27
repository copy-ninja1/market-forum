export { getFirebaseStorage } from "./firebase";

export function listingImagePath(ownerUid: string, listingId: string, fileName: string): string {
  return `listings/${ownerUid}/${listingId}/${fileName}`;
}

export function avatarImagePath(uid: string, fileName: string): string {
  return `avatars/${uid}/${fileName}`;
}
