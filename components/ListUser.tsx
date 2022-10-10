import { ListItem, Flex, Text, Button, useDisclosure, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, Box } from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";



const ListUser: React.FC<any> = ({name, username, userId, setUsers}) =>{

    const updateDis = useDisclosure();//Modal for update
    const updateForm = useForm<any>();//useForm for update

    const deleteDis = useDisclosure();//Modal for delete
    const deleteForm = useForm<any>();//useForm for delete

  
    //UPDATE HANDLER
  const onSubmitUPDATE: SubmitHandler<any> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        console.log(data.json());
        if (data.ok) {
            updateForm.reset();
          updateDis.onClose();
        }
      });
      const resUsers = await fetch(
        `https://63438d663f83935a78552378.mockapi.io/user`
      );
      setUsers(await resUsers.json());
    } catch (error) {
      console.log(error);
    }
  };


  //DELETE HANDLER
  const onSubmitDELETE: SubmitHandler<any> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        console.log(data.json());
        if (data.ok) {
            deleteForm.reset();
          deleteDis.onClose();
        }
      });

      const resUsers = await fetch(
        `https://63438d663f83935a78552378.mockapi.io/user`
      );
      setUsers(await resUsers.json());

    } catch (error) {
      console.log(error);
    }
  };


    return(
        <>
        <ListItem>
            <Flex
                  borderColor={"indigo"}
                  borderWidth={2}
                  borderRadius={"xl"}
                  m={2}
                  p={4}
                  alignItems={"center"}
                  gap={2}
                >

              <Link href={`/users/${userId}`}>
                <Box>
                    <Text>
                        {name}
                        {""}
                    </Text>
                    <Text as={"small"} color={"orange"}>
                        @{username}
                    </Text>
                  </Box>
              </Link>

            <Button backgroundColor={'orange'} float={'right'} onClick={updateDis.onOpen}>UPDATE</Button>
            <Button backgroundColor="red.400" float={'right'} onClick={deleteDis.onOpen}>DELETE</Button>
            </Flex>
        </ListItem>


        {/* {MODAL FOR UPDATE} */}
        <Modal isOpen={updateDis.isOpen} onClose={updateDis.onClose}>
            <ModalOverlay />
            <ModalContent as={"form"} onSubmit={updateForm.handleSubmit(onSubmitUPDATE)}>
            <ModalHeader>UPDATE USER</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack spacing={3}>
                <Input type="hidden" value={userId} {...updateForm.register("id", { required: true })}/>
                <Input
                    placeholder={name}
                    {...updateForm.register("name", { required: true })}
                />
                <Input
                    placeholder={username}
                    {...updateForm.register("username", { required: true })}
                />
                </VStack>
            </ModalBody>
            <ModalFooter gap={2}>
                <Button bg={"orange"} type="submit">
                Submit
                </Button>
                <Button onClick={updateDis.onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>


        {/* {MODAL FOR DELETE} */}
        <Modal isOpen={deleteDis.isOpen} onClose={deleteDis.onClose}>
            <ModalOverlay />
            <ModalContent as={"form"} onSubmit={deleteForm.handleSubmit(onSubmitDELETE)}>
            <ModalHeader>DELETE USER</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack spacing={3}>
                    <Text >Are you sure you want to delete</Text>
                    <Text color={"red.400"}>{name} ?</Text>
                </VStack>
            </ModalBody>
            <ModalFooter gap={2}>
                <Button bg={"orange"} type="submit">
                    YES
                </Button>
                <Button onClick={deleteDis.onClose}>DISCARD</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
        
    )
}

export default ListUser;