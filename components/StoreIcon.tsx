"use client";

interface StoreIconProps {
  store: "android" | "ios";
}

export function StoreIcon({ store = "android" }: StoreIconProps) {
  return (
    <>
      {store === "ios" ? (
        // TODO: Add iOS store icon
        <div>iOS</div>
      ) : (
        // TODO: Add Android store icon
        <div>Android</div>
      )}
    </>
  );
}
