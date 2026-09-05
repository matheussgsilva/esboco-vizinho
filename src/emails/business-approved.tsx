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

interface BusinessApprovedEmailProps {
  ownerName: string | null;
  businessName: string;
  businessUrl: string;
}

export function BusinessApprovedEmail({
  ownerName,
  businessName,
  businessUrl,
}: BusinessApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sua empresa foi aprovada no Esboço Páginas Amarelas</Preview>
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
          <Heading style={{ fontSize: 20 }}>Empresa aprovada 🎉</Heading>
          <Text>Olá{ownerName ? `, ${ownerName}` : ""},</Text>
          <Text>
            Boas notícias: o cadastro de <strong>{businessName}</strong> foi analisado e
            aprovado pela nossa equipe. Sua página já está visível para quem busca negócios
            na sua região.
          </Text>
          <Button
            href={businessUrl}
            style={{
              backgroundColor: "#ea5455",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Ver minha página
          </Button>
          <Text style={{ color: "#6b6b6b", fontSize: 12, marginTop: 24 }}>
            Você pode completar seu perfil (fotos, horários, produtos) a qualquer momento pelo
            painel da empresa.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BusinessApprovedEmail;
