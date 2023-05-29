import { Button } from "@chakra-ui/react";

// Définition de votre composant bouton
function CustomButton({onClick, children}) {
    return (
        <Button colorScheme="teal" onClick={onClick}>
            {children}
        </Button>
    );
}

export default CustomButton;

