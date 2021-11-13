const Errors = {
    POS_01: "Tags parameter is required",
    POS_02: "sortBy parameter is invalid"
};

export const handlePostErrors = (code) => {
    return {
      error: Errors[code],
    };
  };