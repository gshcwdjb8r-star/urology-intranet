export type StaffRole = "스텝" | "전담간호사" | "전공의" | "인턴" | "기타";

export type DutyType = "staff" | "trainee" | "nurse";

export type Profile = {
  id: string;
  name: string;
  role: string;
  created_at: string;
};

export type DutyShift = {
  id: string;
  duty_type: DutyType;
  duty_date: string;
  person_name: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
};

export type TemplateField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date";
  required?: boolean;
};

export type DocumentTemplate = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  fields: TemplateField[];
};

export type SavedDocument = {
  id: string;
  template_id: string | null;
  title: string;
  data: Record<string, string>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ConsentItem = {
  title: string;
  text: string;
};

export type ConsentGuide = {
  id: string;
  surgery_name: string;
  summary: string | null;
  items: ConsentItem[];
  notes: string | null;
  sort_order: number;
};

export type Term = {
  id: string;
  term: string;
  abbreviation: string | null;
  korean: string | null;
  category: "약어" | "용어";
  definition: string;
};

export type Procedure = {
  id: string;
  title: string;
  category: "술기" | "수술";
  indication: string | null;
  content: string;
  complications: string | null;
  sort_order: number;
};

export type Medication = {
  id: string;
  name: string;
  generic_name: string | null;
  category: string;
  indication: string | null;
  dosage: string | null;
  notes: string | null;
};

export type OrderSet = {
  id: string;
  title: string;
  category: string;
  content: string;
  sort_order: number;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_by: string | null;
  created_at: string;
  author?: string | null;
};
