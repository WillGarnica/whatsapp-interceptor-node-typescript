export function removerFormato(contactNumber: string): string {
    if (!contactNumber) return null;
    contactNumber = contactNumber.split("@", 1)[0];
    contactNumber = contactNumber.split(":", 1)[0];
    contactNumber = contactNumber.replace("+", "").replace(" ", "");
    return contactNumber;
}

export function agregarFormato(contactNumber: string): string {
    if (contactNumber == null) return null;
    contactNumber = removerFormato(contactNumber);
    contactNumber = contactNumber + "@s.whatsapp.net";
    return contactNumber;
}