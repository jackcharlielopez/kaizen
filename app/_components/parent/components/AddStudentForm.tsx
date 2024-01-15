import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { trpc } from "@/app/_trpc/client";

const AddStudentForm = () => {
    const { mutate: addStudent, data: student } = trpc.addStudent.useMutation();
  // add parent id
  const studentForm = useForm({
    initialValues: {
      name: "",
      birthDate: "",
    },
  });

  return (
    <form onSubmit={studentForm.onSubmit((values) => addStudent(values))}>
      <TextInput
        label="Full Name"
        placeholder="Full Name"
        withAsterisk
        {...studentForm.getInputProps("name")}
      />
      <DateInput
      withAsterisk
        label="Birth Date"
        placeholder="Birth Date"
        clearable
        {...studentForm.getInputProps("birthDate")}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default AddStudentForm;
