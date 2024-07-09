
export const useGetUserInfo = () => {
    const { userID, email, name } = JSON.parse(
        localStorage.getItem("BonVoyageAuth")
    );

    return {userID, email, name}
};