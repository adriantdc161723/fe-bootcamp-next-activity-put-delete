import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ListUser from "../../components/ListUser";
import { User } from "../../types";

const Posts: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {

  const [users, setUsers] = useState<User[]>(props.users);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  const handleSearch = async (search: string) => {
    const resUsers = await fetch(
      `https://63438d663f83935a78552378.mockapi.io/user?search=${search}`
    );
    setUsers(await resUsers.json());
  };

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        if (data.ok) {
          reset();
          onClose();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box w={"full"} h={"fit-content"}>
        <Button bg={"orange"} fontSize={"2xl"} onClick={onOpen}>
          +
        </Button>
        <Input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search"
        />
        <Divider />
        <List>
          {users.map((user) => (
            <ListUser name={user.name} username={user.username} userId={user.id} key={user.id} setUsers={setUsers}/>
          ))}
        </List>
      </Box>
      {/* MODAL FORM  */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>USER FORM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                placeholder="Name"
                {...register("name", { required: true })}
              />
              <Input
                placeholder="Username"
                {...register("username", { required: true })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button bg={"orange"} type="submit">
              Submit
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const resUsers = await fetch(
    "https://63438d663f83935a78552378.mockapi.io/user"
  );
  const users = await resUsers.json();
  return { props: { users: users } };
};

export default Posts;
