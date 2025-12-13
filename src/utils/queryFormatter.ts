// queryFormatter helper
const queryFormatter = (
  searchParamsObj: { [key: string]: string | string[] | undefined }
): string => {
  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value
        .filter((v) => typeof v === "string" && v.trim() !== "")
        .map(
          (v) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(v.trim())}`
        )
        .join("&");
    }

    if (typeof value === "string" && value.trim() !== "") {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value.trim())}`;
    }

    return "";
  });

  return queryArray.filter(Boolean).join("&");
};

export default queryFormatter;
