import {
  createClient,
  createCurrentUserHook,
} from "next-sanity";

import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  projectId: "kme7it8t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(sanityClient).image(source);

export const useCurrentUser = createCurrentUserHook(config);
