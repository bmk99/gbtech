import { Details } from "@mui/icons-material";
import { Container, Box, Stack, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
  width: "200px",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function AllFiles() {
    const [files,setFiles] = useState([])
  let user = JSON.parse(localStorage.getItem("user"));
  let accesstoken = JSON.parse(localStorage.getItem('accesToken'))
  console.log(user);
  useEffect(() =>{
    const getAllFiles = async () => {
        try {
            const {data} = await axios.get(
                `http://localhost:8000/files/getAll/${user._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accesstoken}`,
                  },
                }
              );
              console.log(data)
            
              setFiles(data.result)
        } catch (error) {
            console.log(error)
            
        }
        
      };
      getAllFiles()

  },[accesstoken,user._id,setFiles])

  
  const uploadFile = () => {};
  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>
          '
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="column"
            useFlexGap
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
              width: "200px",
            }}
          >
            <Item>Item 1</Item>
            <Item>Item 2</Item>
            <Item>Long content</Item>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default AllFiles;
