"use client";

import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import type { Password, PasswordUpdateDTO } from "@/db/schema/passwords";

export default function PasswordForm({
  data,
  updateAction,
}: {
  data: Password;
  updateAction: (values: PasswordUpdateDTO) => Promise<void>;
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  const submitMutation = useMutation({
    mutationFn: updateAction,
  });

  return (
    <div>
      <Form form={form} onFinish={submitMutation.mutate}>
        <Form.Item name="id" hidden>
          <Input readOnly />
        </Form.Item>

        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>

        <Form.Item name="username" label="Username">
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password">
          <Input />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={submitMutation.isPending}
        >
          Update
        </Button>
      </Form>
    </div>
  );
}
