import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { trpc } from "@/app/_trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

const AddStudentForm = (props: { userId: string }) => {
  const queryClient = useQueryClient();
  const initialValues = {
    "Full Name": "",
    "Birth Date": "",
    userId: props.userId,
  };

  const { mutate: addStudent } = trpc.addStudent.useMutation({
    onSuccess: (val) => {
      queryClient.invalidateQueries({
        queryKey: [["getStudents"], { type: "query" }],
      });
      notifications.show({
        title: "Student Added Successfully",
        message: `${val.name} is now added`,
        color: "green",
      });
    },
    onError: (err) => {
      notifications.show({
        title: err.data?.path,
        message: err.message,
        color: "red",
      });
    },
    onSettled: () => {
      studentForm.reset();
      studentForm.setInitialValues({ values: initialValues });
    },
  });

  const studentForm = useForm({
    initialValues,
    validateInputOnBlur: true,
    validate: {
      "Full Name": (value) =>
        value === ""
          ? "Name is required"
          : !/^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value)
          ? "Name should contain only alphabets"
          : !/^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value)
          ? "Please enter both firstname and lastname"
          : null,
      "Birth Date": (value) => (value === "" ? "Birth Date is required" : null),
    },
  });

  return (
    <form onSubmit={studentForm.onSubmit((values) => addStudent(values))}>
      <TextInput
        label="Full Name"
        placeholder="Full Name"
        withAsterisk
        {...studentForm.getInputProps("Full Name")}
      />
      <DateInput
        withAsterisk
        label="Birth Date"
        placeholder="Birth Date"
        clearable
        {...studentForm.getInputProps("Birth Date")}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={!studentForm.isValid()}>
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default AddStudentForm;
