import { Divider, Stack, Typography } from "@mui/material";

type Props = {};

const AnalyticsExplorer = (props: Props) => {
  return (
    <Stack gap={2} height="100%" width={"100%"} py={2}>
      <Stack gap={2}>
        <Typography variant="h6" align="center">
          Analytics
        </Typography>
        <Divider sx={{ borderColor: "rgba(0, 255, 255, 0.2)" }} />
      </Stack>
    </Stack>
  );
};

export default AnalyticsExplorer;
