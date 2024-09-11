"use client";

import { ImageKitContext } from "imagekitio-next";

const ImageKitProvider = ({ children }) => {
  return <ImageKitContext>{children}</ImageKitContext>;
};

export default ImageKitProvider;
