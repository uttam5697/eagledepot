export const getPhoneDigits = (phone?: string | null) =>
  phone?.replace(/\D+/g, "") ?? "";

export const getPhoneTelHref = (phone?: string | null) => {
  const digits = getPhoneDigits(phone);
  return digits ? `tel:${phone}` : "#";
};

export const getWhatsAppUrl = (phone?: string | null, message?: string) => {
  const digits = getPhoneDigits(phone);
  const whatsAppNumber = digits.length === 10 ? `1${digits}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return whatsAppNumber ? `https://wa.me/${whatsAppNumber}${query}` : "#";
};
