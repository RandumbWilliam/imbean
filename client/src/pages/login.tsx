import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useLogin from "../hooks/useLogin";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Icons } from "../components/icons";
import { PasswordInput } from "../components/PasswordInput";

const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = () => {
  const { loading, login } = useLogin();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await login(data.email, data.password);
  }

  return (
    <section className="container relative h-screen grid grid-rows-[auto_1fr]">
      <div className="sticky h-20 w-full flex justify-between">
        <div className="flex gap-4 items-center">
          <img src="logo.svg" alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-semibold tracking-wider">IMBean</h1>
        </div>
        <button className="text-primary text-sm font-medium">Sign Up</button>
      </div>
      <div className="flex gap-10 h-full">
        <div className="min-w-96 h-full flex flex-col gap-12 justify-center">
          <div className="w-full flex flex-col gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-muted-foreground">
              Please log in to your account
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {loading ? "Loading..." : "Login"}
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full">
              <span className="flex gap-3 items-center">
                <Icons.google className="h-4 w-4" />
                <p>Google</p>
              </span>
            </Button>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="max-w-lg">
            <img src="hero.svg" alt="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
