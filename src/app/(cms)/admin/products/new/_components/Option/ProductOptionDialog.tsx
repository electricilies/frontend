import { optionItemSchema, OptionItemValues } from "@/lib/validators/product";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AttributeDialogProps {
  mode: "create" | "edit";
  defaultValues?: OptionItemValues;
  onSave: (data: OptionItemValues) => void;
  // existingOptions: string[];
}

export function ProductOptionDialog({
  mode,
  defaultValues,
  onSave,
}: AttributeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<OptionItemValues>({
    resolver: zodResolver(optionItemSchema),
    defaultValues: {
      name: "",
      values: [""],
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        name: "",
        values: [""],
      });
    }
  }, [mode, defaultValues, form]);

  useEffect(() => {
    if (!open) {
      form.reset(
        mode === "edit" && defaultValues
          ? defaultValues
          : {
              name: "",
              values: [""],
            },
      );
    }
  }, [open, form, mode, defaultValues]);

  const values = form.watch("values");

  const handleAddValue = () => {
    form.setValue("values", [...values, ""]);
  };

  const handleRemoveValue = (indexToRemove: number) => {
    if (values.length === 1) return form.setValue("values", [""]);
    form.setValue(
      "values",
      values.filter((_, index) => index !== indexToRemove),
    );
  };

  const onSubmitLocal = (data: OptionItemValues) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          id={mode === "create" ? "create-option" : "edit-option"}
        >
          {mode === "create" ? (
            <PlusCircle className="size-5" />
          ) : (
            <Edit className="size-6" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit min-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Option" : "Edit Option"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Tạo lựa chọn cho sản phẩm."
              : "Cập nhật lựa chọn của sản phẩm."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit(onSubmitLocal)(e);
          }}
          className="space-y-6 py-4"
          id="option-form"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col"
              >
                <div className={"grid grid-cols-4 items-center gap-4"}>
                  <FieldLabel
                    htmlFor={"name"}
                    className="col-span-1 font-semibold"
                  >
                    Option Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={"name"}
                    aria-invalid={fieldState.invalid}
                    className={"col-span-3"}
                    placeholder="Add option name"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className={"flex w-full items-center gap-2"}>
            <h4 className="text-h4">Values</h4>
            <Button
              id={"add-option-value"}
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleAddValue}
            >
              <PlusCircle className="size-5" />
            </Button>
          </div>
          <div className="space-y-4">
            {values.map((value, index) => (
              <Controller
                key={index}
                name={`values.${index}` as const}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col"
                  >
                    <div className={"grid grid-cols-4 items-center gap-4"}>
                      <FieldLabel
                        className="col-span-1 text-right text-slate-500"
                        htmlFor={field.name}
                      >
                        Value
                      </FieldLabel>
                      <div className="col-span-3 flex items-center gap-2">
                        <Input
                          {...field}
                          id={field.name}
                          value={value}
                          onChange={(e) => {
                            const newValues = [...values];
                            newValues[index] = e.target.value;
                            form.setValue("values", newValues);
                          }}
                          placeholder="Enter value..."
                          aria-invalid={fieldState.invalid}
                        />
                        <Button
                          id={`remove-option-value-${index}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveValue(index)}
                          disabled={values.length === 1}
                        >
                          <Trash2 className={"size-5"} />
                        </Button>
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        className={"col-span-4"}
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            ))}
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form="option-form">
            {mode === "create" ? "Add" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
