import { Difficulty } from "@/lib/enums";
import type { Problem } from "@/lib/types";
import Link from "next/link";
import {
  Box,
  Chip,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

function difficultyColor(d: Difficulty) {
  const colors = {
    [Difficulty.Easy]: "success",
    [Difficulty.Medium]: "warning",
    [Difficulty.Hard]: "error",
  } as const;

  return colors[d];
}

export default function ProblemsList({ problems }: { problems: Problem[] }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        AlgoTrainer Problems
      </Typography>
      <List>
        {problems.map((p) => (
          <ListItem key={p.id} disablePadding divider>
            <ListItemButton component={Link} href={`/problems/${p.slug}`}>
              <ListItemText
                primary={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {p.title}
                    </Box>
                    <Chip
                      size="small"
                      label={p.difficulty}
                      color={difficultyColor(p.difficulty)}
                    />
                  </Stack>
                }
                secondary={p.descriptionMd}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
