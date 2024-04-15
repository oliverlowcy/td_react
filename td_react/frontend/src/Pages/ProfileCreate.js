import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Container,Textarea } from '@chakra-ui/react'
import CreatableSelect from "react-select/creatable";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from '../Context/ChatProvider';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from "axios"

const ProfileCreate = () => {
    
    const [name,setName]=useState("")
    const [bio,setBio]=useState("")
    const [hobbies,setHobbies]=useState([])
    const [majors,setMajors]=useState([])
    const [picLoading,setPicLoading]=useState(false)
    const [pic,setPic]=useState([])
    const toast = useToast()
    const {user,profile} = ChatState()
    const history = useHistory()

    useEffect(()=>{
      const profile = JSON.parse(localStorage.getItem("profile"));
      if(profile){
        history.push("/chats")
      }
    },[])



const Hobbies = [
    "Reading",
    "Writing",
    "Gardening",
    "Cooking",
    "Painting",
    "Photography",
    "Playing an instrument",
    "Hiking",
    "Swimming",
    "Dancing",
    "Yoga",
    "Fishing",
    "Traveling",
    "Watching movies",
    "Playing video games",
    "Knitting",
    "Sculpting",
    "Woodworking",
    "Birdwatching",
    "Cycling",
    "Running",
    "Skiing",
    "Snowboarding",
    "Surfing",
    "Skateboarding",
    "Rock climbing",
    "Skydiving",
    "Scuba diving",
    "Bungee jumping",
    "Horseback riding"
];

const options = [];

Hobbies.forEach((hobby, index) => {
    
    const color = "#000000"
    
    options.push({
        value: hobby.toLowerCase().replace(/ /g, "_"),
        label: hobby,
        color: color
    });
});

const Major = ["Computer Science","Medicine","Law"];
const optionsTwo = [];

Major.forEach((major, index) => {
    
    const color = "#000000"
    
    optionsTwo.push({
        value: major.toLowerCase().replace(/ /g, "_"),
        label: major,
        color: color
    });
});



  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return { ...styles, color: data.color };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: data.color,
        color: "#fff",
      };
    },
    multiValueLabel: (styles, { data }) => {
      return {
        ...styles,
        color: "#fff",
      };
    },
    multiValueRemove: (styles, { data }) => {
      return {
        ...styles,
        color: "#fff",
        cursor: "pointer",
        ":hover": {
          color: "#fff",
        },
      };
    },
  };

  const handleChange = (selectedOption, actionMeta) => {
    setHobbies(selectedOption)
  };

  const handleChangeTwo = (selectedOption, actionMeta) => {
    setMajors(selectedOption)
  };


  const postDetails = (e) => {
    setPicLoading(true)
    console.log(e)
    const pics = Array.from(e.target.files)
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const tempArr = []
    console.log("PIGS",pics)
    for (let index = 0; index < pics.length; index++) {
        var pic = pics[index]
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "mern-chat-app");
            data.append("cloud_name", "dqrckk5su");
            fetch("https://api.cloudinary.com/v1_1/dqrckk5su/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    tempArr.push(data.url.toString())
                    
                })
                .catch((err) => {
                console.log(err);
                });
            } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
            }
        setPic(tempArr)
        setPicLoading(false)
    }
    
  };
  
  const submit = async()=>{
    if(!name || !bio || hobbies.length<=0 || majors.length<=0 || pic.length<=0){
      console.log("##############",pic)
      toast({
        title: "Please fill in all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    
    try{ 
      const hobbieVals = hobbies.map(item => item.value);
      const majorVals = majors.map(item => item.value);
      
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/profile",
        {
          name: name,
          bio: bio,
          hobbies: hobbieVals,
          majors: majorVals,
          pic: pic,
        },
        config
      );
      localStorage.setItem("profile",JSON.stringify(data))
      history.push("/chats")

    }catch(e){
      toast({
        title: e,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

    return (
    <div>
        <Container my = "5" bg="#F7FAFC" px = '10' w="60%" py = "10">
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            </FormControl>
            <Textarea placeholder='Bio' my = "5"  value={bio} onChange={(e) => setBio(e.target.value)}/>
            <FormLabel>Hobbies</FormLabel>
            <CreatableSelect
            options={options}
            onChange={handleChange}
            isMulti
            styles={colorStyles}
            
            />
            
            <FormLabel mt="5">Major</FormLabel>
            <CreatableSelect
            options={optionsTwo}
            onChange={handleChangeTwo}
            isMulti
            styles={colorStyles}
            
            />

            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <input type="file" name="filefield" multiple="multiple"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e)}
                />
            </FormControl>
            <button onClick = {submit} isloading = {picLoading}>Submit</button>
        </Container>
        
        
        
    </div>
  )
}

export default ProfileCreate
