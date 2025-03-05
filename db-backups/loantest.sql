-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2025 at 02:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loantest`
--

-- --------------------------------------------------------

--
-- Table structure for table `loanapplication`
--

CREATE TABLE `loanapplication` (
  `id` int(11) NOT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `apply_date` date DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `loan_type` enum('BUSINESS','CAR','EDUCATION','HOME','PERSONAL') DEFAULT NULL,
  `second_name` varchar(255) DEFAULT NULL,
  `tel_no` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loanapplication`
--

INSERT INTO `loanapplication` (`id`, `amount`, `apply_date`, `dob`, `first_name`, `id_number`, `loan_type`, `second_name`, `tel_no`, `status`) VALUES
(1, 2555.36, '2025-03-08', '2025-03-07', 'wasath', '12354165', 'EDUCATION', 'deminda', '7116465', 'APPROVED'),
(2, 10000.50, '2025-03-04', '1990-01-01', 'John', 'ID123456', 'PERSONAL', 'Doe', '1234567890', 'PENDING'),
(3, 9000.00, '2025-03-04', '2000-01-01', 'shady', 'A1234567', 'PERSONAL', 'Doe', '1234567890', 'PENDING'),
(4, 12000.00, '2025-03-04', '2003-01-01', 'deminda', 'A12345ff67', 'PERSONAL', 'll', '12345678390', 'PENDING'),
(5, 12000.00, '2025-03-04', '2003-01-01', 'eminem', 'A12345ff67', 'PERSONAL', 'll', '12345678390', 'PENDING'),
(6, 12000.00, '2025-03-04', '2003-01-01', '2pac', 'A12345ff67', 'PERSONAL', 'll', '12345678390', 'PENDING'),
(7, 12000.00, '2025-03-04', '2003-01-01', 'kendrik', 'A12345ff67', 'PERSONAL', 'dsaf', '12345678390', 'PENDING'),
(8, 12000.00, '2025-03-04', '2003-01-01', 'kendrik', 'A12345ff67', 'PERSONAL', 'dsaf', '12345678390', 'PENDING'),
(9, 12000.00, '2025-03-04', '2003-01-01', 'snoop', 'A12345ff67', 'PERSONAL', 'dsaf', '12345678390', 'PENDING'),
(10, 12000.00, '2025-03-04', '2003-01-01', 'lil', 'A12345ff67', 'PERSONAL', 'dsaf', '12345678390', 'APPROVED'),
(11, 122000.00, '2025-03-04', '2003-01-01', 'walker', 'A12345ff67', 'PERSONAL', 'dr', '12345678390', 'PENDING'),
(12, 122000.00, '2025-03-04', '2003-01-01', 'mathive', 'A12345ff67', 'PERSONAL', 'dr', '12345678390', 'APPROVED'),
(13, 2000000.00, '2025-03-04', '2003-01-01', 'shady', 'A12345ff67', 'HOME', 'dr', '12345678390', 'PENDING'),
(14, 2000000.00, '2025-03-04', '2003-01-01', 'rocky', 'A12345ff67', 'HOME', 'dr', '12345678390', 'PENDING'),
(15, 10000.00, '2025-03-04', '1990-01-01', 'deminda', 'ID123456', 'PERSONAL', 'jayawardanawa', '1234567890', 'PENDING'),
(16, 10000.00, '2025-03-04', '1990-01-01', 'thimira', 'ID123456', 'PERSONAL', 'jayawardanawa', '1234567890', 'APPROVED'),
(17, 10000.00, '2025-03-04', '1990-01-01', 'kasun', 'ID123456', 'PERSONAL', 'jayawardanawa', '1234567890', 'PENDING');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `loanapplication`
--
ALTER TABLE `loanapplication`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `loanapplication`
--
ALTER TABLE `loanapplication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
