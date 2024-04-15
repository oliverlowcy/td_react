import React, { useState,useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from "axios"
import { useToast } from "@chakra-ui/toast";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Heading, Text, Divider, Button, ButtonGroup,Stack} from "@chakra-ui/react";

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
            toast({
                title: "Error Occured!",
                description: "Failed to Load new stack profile",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    };
  
    const handleSkip = async()=>{
        setSkipIndicator(!skipIndicator)
    }

    return (

        
        <div>

            {loading ? (<>
                
            </>):(<>
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
            <Button variant='solid' colorScheme='blue' onClick={handleSkip}>
              Next
            </Button>
            <Button variant='ghost' colorScheme='blue'>
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
            </>)}

        </div>
    )
}

export default StackPage
