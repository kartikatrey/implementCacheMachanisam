<template>
	<div class="page-invoice scrollable">
		<div class="toolbar">
			<el-button class="animated fadeInRight" type="primary" plain size="small"><i class="mdi mdi-cart"></i> Check out</el-button>			
			<el-button class="animated fadeInRight" plain size="small" @click="print"><i class="mdi mdi-printer"></i> Print</el-button>		
		</div>

		<div class="invoice bg-white black-text">		
			<div class="invoice-top">
				<div class="logo">
					<img src="@/assets/images/logo-ai.svg" alt="logo">
				</div>
				<div class="info">
					<h2>John Wick</h2>
					<p>jwick@email.com<br>777-777-7777</p>
				</div><!--End Info-->
				<div class="title">
					<h1>Invoice #1337</h1>
					<p>Issued: May 23, 2018<br>Payment Due: June 23, 2018</p>
				</div><!--End Title-->
			</div><!--End InvoiceTop-->

			<hr>			

			<div class="invoice-middle">
				<div class="clientlogo">
					<img src="@/assets/images/avatar.jpg" alt="client logo">
				</div>
				<div class="info">
					<h2>Client Name</h2>
					<p>john.doe@email.com<br>555-555-5555</p>
				</div>

				<div class="project">
					<h2>Project Description</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in diam sit amet felis ultricies ultricies vitae et tortor. Proin dapibus justo felis, ut imperdiet lacus accumsan quis.</p>
				</div>   
			</div><!--End Invoice Mid-->

			<div class="invoice-bottom">
			<DataTable :parameters="requiredParam" :actionsTemplate="actionsTemplate" :columnTemplate="columnTemplate">
	   <div slot='headerSlot' class="table-data-belt border ph-10 pv-10 card-shadow--medium">
        <div class="flex">
          <div class="box">
            <el-button type="text">
              <i class="mdi mdi-minus-circle-outline el-icon-left"></i> Block
            </el-button>
            <el-button type="text">
              <i class="mdi mdi-check-circle-outline el-icon-left"></i> Activate
            </el-button>
            <el-button type="text">
              <i class="mdi mdi-delete-empty el-icon-left"></i>
              Delete
            </el-button>
          </div>
          <div class="box center">&nbsp;</div>
          <div class="box right-sec">
            <div class="search-container">
              <el-input
                placeholder="Search"
                v-on:keyup.native="globalSearch"
                v-model="searchTerm"
                class="input-with-select"
              >
                <el-button slot="append" v-on:click.native="globalSearch" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <el-button type="text">
              <i class="mdi mdi-filter-variant el-icon-left"></i>
            </el-button>
            <download-excel
              class="btn btn-default btn-export"
              :data="rowsToBeExported"
              worksheet="My Worksheet"
              name="filename.xls"
            >
              <el-button type="text">
                <i class="mdi mdi-arrow-collapse-down el-icon-left"></i> Export
              </el-button>
            </download-excel>
          </div>
        </div>
      </div>

				
			</DataTable>
				<!-- <table>
					<thead>
						<tr>
							<th>Item Description</th>
							<th>Hours</th>
							<th>Rate</th>
							<th>Sub-total</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Service 1</td>
							<td>6</td>
							<td>$55</td>
							<td>$330.00</td>
						</tr>
						
						<tr>
							<td>Service 2</td>
							<td>3</td>
							<td>$75</td>
							<td>$225.00</td>
						</tr>
						
						<tr>
							<td>Service 3</td>
							<td>4</td>
							<td>$75</td>
							<td>$300.00</td>
						</tr>
						
						<tr>
							<td>Service 4</td>
							<td>250</td>
							<td>$65</td>
							<td>$16,250.00</td>
						</tr>
						
						<tr>
							<td>Service 5</td>
							<td>10</td>
							<td>$70</td>
							<td>$700.00</td>
						</tr>
						
						<tr>
							<td></td>
							<td>HST</td>
							<td>13%</td>
							<td>$2,314.65</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td class="Rate"><h2>Total</h2></td>
							<td class="payment"><h2>$20,119.65</h2></td>
						</tr>
					</tfoot>
				</table> -->
				
				<div class="legalcopy flex mt-20">
					<p class="legal box grow mr-20 mt-0">
						<strong>Thank you for your business!</strong>  
						Payment is expected within 31 days; please process this invoice within that time. There will be a 5% interest charge per month on late invoices. 
					</p>
					<el-button type="primary" plain size="small" style="height:32px;"><i class="mdi mdi-cart"></i> Check out</el-button>
				</div>
				 
				
			</div><!--End Invoice-->
		</div>
	</div>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import { _ } from "vue-underscore";
export default {
  name: "Invoice",
  components: { DataTable },
  data() {
    return {
      requiredParam: {
        apiName: "/portal/api/table/chatlog", //add your API url here
        // showPaginationOptions:false, // to show/hide pagination option
        // showSelectOptions:false, // to hide/show select checkbox option
        // showSortOptions:false, //  to hide/show sort options
        // showHeader:false, //  to hide/show custom header (which contains options like export...)
        tableName: "chatlog", // it is use to get headers of table from tableHeaderConfig.js
        isRestify: true, // to check whether it is a restifycall or ajaxcall
        limit: 10 // to limit the number of records to be fetched
      }
    };
  },
  methods: {
    print() {
      window.print();
    },
    actionButton() {
      console.log("#####################################");
		},
	
    actionsTemplate(props) {
      console.log("inside template component..." + JSON.stringify(props));
      var icons;
      if (props.row["feedback"] == "thumbsDown") {
        icons = `<button @click="actionButton"><i class="mdi mdi-minus-circle-outline el-icon-left"></i></button>`;
      } else {
        icons = `<button @click="actionButton"><i  class="mdi mdi-check-circle-outline el-icon-left"></i></button>`;
      }
      var template =
        `<el-tooltip content="Bottom center" placement="bottom">` +
        icons +
        ` </el-tooltip> `;
      return template;
    },
    columnTemplate(props) {
      var template =
        `<el-badge class="mark" value="` +
        props.row["feedback"] +
        `">	</el-badge>`;

      return template;
    }
  }
};
</script>

<style lang="scss">
</style>

