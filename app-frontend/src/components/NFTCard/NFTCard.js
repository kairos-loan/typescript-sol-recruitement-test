import React from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import styles from "./style.module.scss";

function _calculateDifference(durationInMilliseconds) {
    let differenceInMinutes = durationInMilliseconds / (1000 * 60);
    let differenceInHours = durationInMilliseconds / (1000 * 60 * 60);
    let differenceInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

    return {
        differenceInMinutes: differenceInMinutes,
        differenceInHours: differenceInHours,
        differenceInDays: differenceInDays,
    }
}

function _getStackingMsg(difference) {
    if (difference.differenceInMinutes < 60) {
        return `Stacked ${Math.floor(difference.differenceInMinutes)} minutes ago`;
    } else if (difference.differenceInHours < 24) {
        return `Stacked ${Math.floor(difference.differenceInHours)} hours ago`;
    } else {
        return `Stacked ${Math.floor(difference.differenceInDays)} days ago`;
    }
}

function NFTCard({name, description, image, nftId, stackingTime, status, isApproved, mutationApproval, mutationStacking, mutationWithdraw}) {
    let stackingMsg;
    if (stackingTime) {
        let now = new Date();
        let nftDate = new Date(stackingTime);
        let difference = _calculateDifference(now.getTime() - nftDate.getTime());
        stackingMsg = _getStackingMsg(difference);
    }

return (<div className={styles.cardContainer}>
    <div>{name}</div>
    <div>{description}</div>
    <img src={image}/>
    <div>TokenId: {nftId}</div>
    <div>Status: {status}</div>
    {stackingMsg && <div>{stackingMsg}</div>}
    {status === "stackable" && mutationApproval && !isApproved &&
        <div><CustomButton onClick={mutationApproval}>Approve it!</CustomButton></div>}
    {status === "stackable" && mutationStacking && isApproved &&
        <div><CustomButton onClick={mutationStacking}>Stack it!</CustomButton></div>}
    {status === "stacked" && mutationWithdraw &&
        <div><CustomButton onClick={mutationWithdraw}>Unstack it!</CustomButton></div>}
</div>)

}

export default NFTCard;