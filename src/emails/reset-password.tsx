import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string | null;
  resetUrl: string;
}

export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefina sua senha do Esboço Páginas Amarelas</Preview>
      <Body style={{ backgroundColor: "#f6f6f6", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 32,
            margin: "40px auto",
            maxWidth: 480,
          }}
        >
          <Heading style={{ fontSize: 20 }}>Redefinir senha</Heading>
          <Text>Olá{name ? `, ${name}` : ""},</Text>
          <Text>
            Recebemos uma solicitação para redefinir a senha da sua conta. Clique no
            botão abaixo para escolher uma nova senha. Este link expira em 1 hora.
          </Text>
          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#ea5455",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Redefinir senha
          </Button>
          <Text style={{ color: "#6b6b6b", fontSize: 12, marginTop: 24 }}>
            Se você não solicitou essa alteração, pode ignorar este email com segurança.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;
