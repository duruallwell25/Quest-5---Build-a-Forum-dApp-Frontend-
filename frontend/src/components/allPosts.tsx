import { readContract } from "@wagmi/core";
import config from "../wagmi";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import type { PostDetails } from "../types/posts/types";

const allPosts = async () => {
    try {
        const postIdIncrement = (await readContract(config, {
            abi: ABI,
            address: deployedAddress,
            functionName: "postIdIncrement",
            args: [],
        })) as bigint;

        console.log("Post ID Increment Value:", postIdIncrement); // Log the value for debugging

        const posts: Promise<PostDetails | undefined>[] = [];
        // Assuming the first post is initialized at index 1
        for (let i = 1; i < postIdIncrement; i++) {
            const post: Promise<PostDetails | undefined> = readContract(config, {
                abi: ABI,
                address: deployedAddress,
                functionName: "getPost",
                args: [BigInt(i)],
            }) as Promise<PostDetails | undefined>;

            posts.push(post);
        }

        return await Promise.all(posts).then((values) => {
            const binding = values.filter((post): post is PostDetails => !!post);
            return binding;
        });
    } catch (error) {
        console.error("Error in allPosts:", error);
        return []; // Return an empty array or handle as needed
    }
};

export default allPosts;
