export interface ITransferCertificate {
  id: string;
  reason: string | null;
  status: string;
  issuedDate: string | null;
  tcDocumentUrl: string | null;
  createdAt: string;
  student: {
    id: string;
    user: { id: string; name: string | null; email: string | null };
    class: { id: string; name: string; section: string | null } | null;
  };
  requestedBy: { id: string; name: string | null; email: string | null } | null;
  approvedBy: { id: string; name: string | null; email: string | null } | null;
}