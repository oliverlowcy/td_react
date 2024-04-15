import React, { useState,useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from "axios"
import { useToast } from "@chakra-ui/toast";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Heading, Text, Divider, Button, ButtonGroup,Stack,Image} from "@chakra-ui/react";

const StackPage = () => {
    const [loading,setLoading] = useState(true);
    const [stackProfile,setStackProfile] = useState();
    const [skipIndicator,setSkipIndicator] = useState(true);
    const {user} = ChatState()
    
    const toast = useToast();

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        fetchStack(user);
    },[skipIndicator])

    const fetchStack = async (user)=>{
        try{
            if(user){
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setLoading(true);

                const { data } = await axios.get(
                    `http://localhost:5000/api/profile/stack`,
                config
                );
                console.log(data)
                setStackProfile(data)
                setLoading(false);
            }
            
        }catch(e){
            
            setLoading(false);
            setStackProfile()
        }

    };
  
    const handleLike = async(profile)=>{
        const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`http://localhost:5000/api/profile/like`,{userId:profile.user},config);
        if(data.match){
            const config2 = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
                },
            };
            const { data2 } = await axios.post(`http://localhost:5000/api/chat/`,{userId:profile.user},config);
            console.log(data2)
        }

        setSkipIndicator(!skipIndicator)
    }

    const handleUnlike = async(profile)=>{
        console.log(user)
        const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post(`http://localhost:5000/api/profile/unlike`,{userId:profile.user},config);


        setSkipIndicator(!skipIndicator)
    }


    return (

        
        <div>

            {loading ? (<>
                
            </>):(<>
                {stackProfile ? (<>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Card maxW='sm'>
                        <CardBody>
                        <Stack mt='6' spacing='3'>
                            <Heading size='md'>Living room Sofa</Heading>
                            <Text>
                            {stackProfile && stackProfile.name}
                            </Text>
                        </Stack>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                        <ButtonGroup spacing='2'>
                            <Button variant='solid' colorScheme='blue' onClick={()=>handleLike(stackProfile)}>
                            Like
                            </Button>
                            <Button variant='ghost' colorScheme='blue' onClick={()=>handleUnlike(stackProfile)}>
                            Unlike
                            </Button>
                        </ButtonGroup>
                        </CardFooter>
                    </Card>
                </div>
</>):(<>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center'}}>
                    <Card maxW='sm'>
  <CardBody>
    <Image
      src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
      alt='Green double couch with wooden legs'
      borderRadius='lg'
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md'>Ooops... Dead end</Heading>
      <Text>
        Please try again later
      </Text>
      
    </Stack>
  </CardBody>
  <Divider />

</Card>
                </div>
    
</>)}
            </>)}

        </div>
    )
}

export default StackPage

