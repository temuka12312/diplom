import "../style/auth.css";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return <div className="auth-wrapper">{children}</div>;
}