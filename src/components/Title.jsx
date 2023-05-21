import { Typography } from "@mui/material";

export const Title = ({prop}) => {
  return (
    <Typography
      variant={'h2'}
      mt={5}
      margin={5}
      fontWeight={'bold'}
     > {prop} 
    </Typography>
  )
}