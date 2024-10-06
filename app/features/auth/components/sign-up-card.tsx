import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types"
import { useState } from "react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
};

export const SignUpCard = ({ setState }: SignUpCardProps) => {

  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password do not match");
      return;
    };

    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Somethin went wrong");
      })
      .finally(() => {
        setPending(false);
      })
  }

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value)
      .then(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8 border-red-300 bg-[#000401]">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-red-300">
          Sign up to continue
        </CardTitle>
        <CardDescription className="text-red-400">
          use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-5">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            placeholder="Full name"
            type="text"
            required
            className="focus:border-red-300 bg-red-300 border-[#24020e]"
          />
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder="Email"
            type="email"
            required
            className="focus:border-red-300 bg-red-300 border-[#24020e]"
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            placeholder="Password"
            type="password"
            required
            className="focus:border-red-300 bg-red-300 border-[#24020e]"
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
            placeholder="Confirm Password"
            type="password"
            required
            className="focus:border-red-300 bg-red-300 border-[#24020e]"
          />
          <Button 
          type="submit" 
          className="w-full" 
          size='lg' 
          disabled={pending}
          variant='quality'
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("google")}
            variant='qualityLight'
            size="lg"
            className="w-full relative"          >
            <FcGoogle className="size-5 absolute left-2.5 top-auto" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            variant='qualityLight'
            size="lg"
            className="w-full relative"          >
            <FaGithub className="size-5 absolute left-2.5 top-auto" />
            Continue with Github
          </Button>
        </div>
        <p className="text-red-300 text-xs text-muted-foreground">
          Already have a account? <span onClick={() => setState("signIn")} className="text-sky-700 hover:underline cursor-pointer">Sign in</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUpCard;