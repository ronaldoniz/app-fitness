export interface FormActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const initialFormActionState: FormActionState = {
  status: "idle",
  message: "",
};
