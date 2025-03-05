import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Verification Code for Mystery Message</Preview>
      <Body style={{ backgroundColor: "#ffffff" }}>
        <Container>
          <Section style={{ padding: "20px" }}>
            <Heading>Hello {username},</Heading>
            <Text>
              Your verification code is: 
              <strong style={{ display: "block", fontSize: "24px", marginTop: "10px" }}>
                {otp}
              </strong>
            </Text>
            <Text>
              This code will expire in 10 minutes. 
              Do not share this code with anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default VerificationEmail;