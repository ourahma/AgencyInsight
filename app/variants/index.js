export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

export const itemVariants = {
   hidden: { y: 20, opacity: 0 },
   visible: {
     y: 0,
     opacity: 1,
     transition: {
       type: "spring",
       stiffness: 100,
     },
   },
 };

export const progressVariants = {
   hidden: { width: 0 },
   visible: {
     width: "100%",
     transition: {
       duration: 1.5,
       ease: "easeOut",
     },
   },
 };