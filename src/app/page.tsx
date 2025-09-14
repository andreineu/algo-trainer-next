import Link from "next/link";
import { Container, Stack, Typography, Button } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={2} alignItems="start">
        <Typography variant="h3">AlgoTrainer</Typography>
        <Typography variant="body1">
          Solve algorithm problems with a Monaco editor and run tests in your
          browser.
        </Typography>
        <Button variant="contained" component={Link} href="/problems">
          Browse Problems
        </Button>
      </Stack>
    </Container>
  );
}
