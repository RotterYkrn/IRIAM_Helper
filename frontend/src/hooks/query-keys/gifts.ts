export const giftKeys = {
    all: ["gifts"] as const,
    lists: () => [...giftKeys.all, "lists"] as const,
    categories: () => [...giftKeys.all, "categories"] as const,
};
