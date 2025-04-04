import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Link,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Visibility as DetailsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  Repeat as RepeatIcon,
  Email as EmailIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Call as CallIcon,
  Work as WorkIcon,
  Error as ErrorIcon,
  ShoppingBag as ShoppingBagIcon,
  SchoolRounded as SchoolRoundedIcon,
} from "@mui/icons-material";

import { useState } from "react";
import moment from "moment";

export default function TableComponent({
  tableColumns,
  searchResults,
  setSearchResults,
  handleView,
  handleEdit,
  handleDelete,
}) {
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  function handleSort(column) {
    if (column.key === sortBy) {
      // if same column selected, reverse
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      setSearchResults([...searchResults].reverse());
    } else {
      // if different column selected, sort desc
      setSortDirection("desc");
      setSortBy(column.key);

      sortTable(column);
    }
  }

  function sortTable(column) {
    setSearchResults(
      searchResults.sort((a, b) => {
        if (a[column.key] === null) {
          return 1;
        } else if (b[column.key] === null) {
          return -1;
        } else if (column.key === "frresp") {
          (
            a[column.key].firstName +
            " " +
            a[column.key].lastName
          ).localeCompare(
            b[column.key].firstName + " " + b[column.key].lastName
          );
        } else {
          // TODO: sorting numbers is still broken
          // toString needed when sorting numbers
          return a[column.key]
            .toString()
            .localeCompare(b[column.key].toString());
        }
      })
    );
  }

  function getFormatedCellValue(column, value) {
    if (column.key === "frresp") {
      return value.firstName + " " + value.lastName;
    } else if (column.key === "webUrl") {
      return (
        <Link href={value} target="_blank">
          {value}
        </Link>
      );
    } else if (column.key === "endDate") {
      return moment(value).format("DD.MM.YYYY.");
    } else if (column.key === "comment") {
      return (
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      );
    } else if (
      column.key === "category" &&
      (value.includes("FINANCIAL") ||
        value.includes("MATERIAL") ||
        value.includes("ACADEMIC"))
    ) {
      const iconAttributes = {
        sx: { color: "#1976d2" },
      };
      const icons = [];
      if (value.includes("FINANCIAL")) {
        icons.push(
          <Tooltip title={"Financial"} key="Financial">
            <AttachMoneyIcon {...iconAttributes} />
          </Tooltip>
        );
      }
      if (value.includes("MATERIAL")) {
        icons.push(
          <Tooltip title={"Material"} key="Material">
            <ShoppingBagIcon {...iconAttributes} />
          </Tooltip>
        );
      }
      if (value.includes("ACADEMIC")) {
        icons.push(
          <Tooltip title={"Academic"} key="Academic">
            <SchoolRoundedIcon {...iconAttributes} />
          </Tooltip>
        );
      }

      return icons;
    } else if (column.key === "status") {
      const iconAttributes = {
        fontSize: "large",
        sx: { color: "#1976d2" },
      };

      let icon = null;
      let tooltipText = (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      )
        .split("_")
        .join(" ");

      switch (value) {
        case "TODO":
          icon = <AssignmentTurnedInIcon {...iconAttributes} />;
          break;
        case "CONTACTED":
          icon = <CallIcon {...iconAttributes} />;
          break;
        case "PINGED":
          icon = <RepeatIcon {...iconAttributes} />;
          break;
        case "OFFER_SENT":
          icon = <EmailIcon {...iconAttributes} />;
          break;
        case "MEETING_HELD":
          icon = <WorkIcon {...iconAttributes} />;
          break;
        case "SUCCESSFUL":
          icon = <AttachMoneyIcon {...iconAttributes} />;
          break;
        case "UNSUCCESSFUL":
          icon = <MoneyOffIcon {...iconAttributes} />;
          break;
        default:
          icon = <ErrorIcon {...iconAttributes} />;
          tooltipText = "Unknown status: " + value;
          break;
      }

      return <Tooltip title={tooltipText}>{icon}</Tooltip>;
    } else {
      return value;
    }
  }

  return (
    <Table
      stickyHeader
      size="small"
      sx={{
        paddingBottom: 2,
      }}
    >
      <TableHead>
        <TableRow>
          {tableColumns.map((column) => (
            <TableCell
              key={column.key}
              sx={{
                display: {
                  xs: column.xsHide ? "none" : "table-cell",
                  md: column.mdHide ? "none" : "table-cell",
                  lg: "table-cell",
                },
                padding: 0.5,

                width: "min-content",

                textAlign: column.centerContent && "center",

                whiteSpace: "nowrap",
              }}
            >
              {column.notSortable ? (
                column.label
              ) : (
                <TableSortLabel
                  active={sortBy === column.key}
                  direction={sortBy === column.key ? sortDirection : "desc"}
                  onClick={() => handleSort(column)}
                >
                  {column.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}

          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {searchResults.map((result) => (
          <TableRow key={result.id}>
            {tableColumns.map((column) => {
              const cellValue = result[column.key];

              return (
                <TableCell
                  key={column.key}
                  sx={{
                    display: {
                      xs: column.xsHide ? "none" : "table-cell",
                      md: column.mdHide ? "none" : "table-cell",
                      lg: "table-cell",
                    },

                    padding: 0.5,

                    backgroundColor: result.priority && "whitesmoke",

                    textAlign: column.centerContent && "center",

                    width: "min-content",

                    overflow: "hidden",
                    textOverflow: column.showTooltip ? "ellipsis" : "unset",
                    whiteSpace: column.showTooltip ? "nowrap" : "unset",
                    maxWidth: column.showTooltip ? "30ch" : "60ch", // required so the cell doesnt overflow
                  }}
                >
                  {getFormatedCellValue(column, cellValue)}
                </TableCell>
              );
            })}

            <TableCell
              sx={{
                padding: 0.5,

                backgroundColor: result.priority ? "whitesmoke" : "inherit",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,

                  padding: 0.5,

                  backgroundColor: result.priority ? "whitesmoke" : "inherit",
                }}
              >
                {handleView && (
                  <Tooltip title="Details" key="Details">
                    <IconButton
                      size="small"
                      onClick={() => handleView(result)}
                      sx={{
                        color: "white",
                        backgroundColor: "#1976d2",

                        borderRadius: 1,

                        width: { xs: 20, md: "unset" },
                      }}
                    >
                      <DetailsIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {handleEdit && (
                  <Tooltip title="Edit" key="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(result)}
                      sx={{
                        color: "white",
                        backgroundColor: "#1976d2",

                        borderRadius: 1,

                        width: { xs: 20, md: "unset" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {handleDelete && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(result)}
                      sx={{
                        color: "white",
                        backgroundColor: "#1976d2",

                        borderRadius: 1,

                        width: { xs: 20, md: "unset" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
