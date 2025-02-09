import { Box, Divider, Stack, Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { db } from "../services/firebase.service";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BarChart } from "@mui/x-charts/BarChart";

type Props = {};

const AnalyticsExplorer = (props: Props) => {
  const [voices, loading, error] = useCollectionData(collection(db, "voices"));

  return (
    <Stack gap={4} height="100%" width={"100%"} py={2}>
      <Typography variant="h6" align="center">
        Analytics
      </Typography>
      <Divider sx={{ borderColor: "rgba(0, 255, 255, 0.2)" }} />

      <Stack gap={2}>
        <Typography variant="h6">Audio Distribution</Typography>
        <Box
          width={"80%"}
          height={200}
          sx={{ border: "1px solid rgba(0, 255, 255, 0.2)" }}
          borderRadius={2}
          mx="auto"
        >
          <BarChart
            series={[{ data: [120, 100, 98, 112, 106, 56, 99] }]}
            height={200}
            xAxis={[
              {
                scaleType: "band",
                data: [
                  "Happy",
                  "Sad",
                  "Angry",
                  "Surprise",
                  "Fear",
                  "Disgust",
                  "Neutral",
                ],
              },
            ]}
          />
          {/* TODO: bar chart with coming soon with less opacity */}
        </Box>
        <Typography align="center">Total Samples: {voices?.length}</Typography>
      </Stack>

      <Stack
        gap={2}
        sx={{
          border: "1px solid rgba(0, 255, 255, 0.2)",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Duration Stats</Typography>
        <Typography variant="body1">Average Duration: 1:52</Typography>
        <Typography variant="body1">Longest Duration: 2:01</Typography>
        <Typography variant="body1">Shortest Duration: 1:27</Typography>
      </Stack>
    </Stack>
  );
};

export default AnalyticsExplorer;
